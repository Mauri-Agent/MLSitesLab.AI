# Codebase Analysis & Solution Proposals — Milestone 2

This report presents a read-only codebase investigation and structured solution proposals for the four key requirements of Milestone 2.

---

## 1. Hero Layout Restructuring in `src/App.tsx`

### Observation
In `src/App.tsx`, the layout structure within the `main` container is currently defined as follows (lines 23-34):
```tsx
        <main className="app-container">
          <Cursor />
          <Navbar />
          <Hero />
          <div className="divider" />
          <InteractiveFunnel />
          <div className="divider" />
          <Services />
          <div className="divider" />
          <Portfolio />
          <Footer />
        </main>
```

### Analysis & Proposal
To make `InteractiveFunnel` the main Hero section (the first content block inside `<main>`) and reposition the classic `Hero` component below it, we must swap their layout ordering.
The structural flow should be:
1. `Cursor` (interactive overlay element)
2. `Navbar` (navigation element)
3. `InteractiveFunnel` (now acting as the main Hero)
4. Divider
5. `Hero` (positioned below the funnel)
6. Divider
7. `Services`
8. Divider
9. `Portfolio`
10. `Footer`

### Proposed Modification
```tsx
<<<<
        <main className="app-container">
          <Cursor />
          <Navbar />
          <Hero />
          <div className="divider" />
          <InteractiveFunnel />
          <div className="divider" />
          <Services />
====
        <main className="app-container">
          <Cursor />
          <Navbar />
          <InteractiveFunnel />
          <div className="divider" />
          <Hero />
          <div className="divider" />
          <Services />
>>>>
```

---

## 2. Double Welcome Greeting in Chat (`src/components/InteractiveFunnel.tsx`)

### Observation
Inside `src/components/InteractiveFunnel.tsx`, the initial AI greeting fetch is triggered on mount by the following `useEffect` hook (lines 43-47):
```tsx
  // Initial trigger to get first AI message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'system') {
      fetchAIResponse(messages);
    }
  }, []);
```
In React 18 StrictMode (enabled in development in `src/main.tsx`), components mount, unmount, and remount sequentially. Since `fetchAIResponse` is an asynchronous operation, the effect runs twice and triggers two concurrent API requests. When both requests resolve, they both append their responses to the state, causing a duplicate welcome message.

### Analysis & Proposal
To resolve the double fetch, we can use an `AbortController` to cancel any outstanding fetch request when the component unmounts.
1. Update `fetchAIResponse` signature to accept an optional `AbortSignal`.
2. Pass `signal` to the `fetch` options inside `fetchAIResponse`.
3. Catch the resulting `AbortError` to prevent updating state or logging errors for aborted calls.
4. Ensure `setIsTyping(false)` is only called if the signal is not aborted.
5. In `useEffect`, instantiate an `AbortController`, pass its signal to `fetchAIResponse`, and call `abort()` in the cleanup function.

### Proposed Modification

#### Step 2.1: Update `fetchAIResponse` definition and error handling:
```tsx
<<<<
  const fetchAIResponse = async (chatHistory: Message[]) => {
    setIsTyping(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: 'ERROR: COMUNICACIÓN PERDIDA. REINTENTE.' }]);
    } finally {
      setIsTyping(false);
    }
  };
====
  const fetchAIResponse = async (chatHistory: Message[], signal?: AbortSignal) => {
    setIsTyping(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
        }),
        signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: aiReply }]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Silently return when the request is aborted on unmount
        return;
      }
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: 'ERROR: COMUNICACIÓN PERDIDA. REINTENTE.' }]);
    } finally {
      if (!signal || !signal.aborted) {
        setIsTyping(false);
      }
    }
  };
>>>>
```

#### Step 2.2: Update mount `useEffect` hook:
```tsx
<<<<
  // Initial trigger to get first AI message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'system') {
      fetchAIResponse(messages);
    }
  }, []);
====
  // Initial trigger to get first AI message
  useEffect(() => {
    const controller = new AbortController();
    if (messages.length === 1 && messages[0].role === 'system') {
      fetchAIResponse(messages, controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, []);
>>>>
```

---

## 3. Stuck General Page Scroll (CSS & Navbar Audit)

### Observation
In `src/index.css`, both the `html` and `body` selectors apply `overflow-x: hidden;` (lines 60-73):
```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
Setting `overflow-x: hidden` simultaneously on the `html` and `body` elements is known to disable scroll gesture chaining, cause viewport freezing, and lock vertical scrolling on several mobile viewports (e.g., iOS Safari or Android Chrome) when elements dynamically animate or resize.

### Analysis & Proposal
To unlock natural page scrolling:
1. Remove `overflow-x: hidden` from the `html` element to allow the viewport to scroll naturally.
2. Apply `overflow-x: clip` or `overflow-x: hidden` exclusively on the `body` or a main wrapper container to prevent horizontal scrollbars without affecting vertical scrolling.
3. Ensure no JS styles accidentally lock `overflow` permanently. The navbar modal toggle code in `src/components/Navbar.tsx` (lines 22-25) locks body overflow to `'hidden'` when `menuOpen` is active, but correctly reverts to `''` when closed or unmounted.

### Proposed Modification
In `src/index.css` (lines 60-73):
```css
<<<<
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
====
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-dark);
  color: var(--text-primary);
  line-height: 1.65;
  overflow-x: clip; /* clip avoids creating a scroll container while hiding x-overflow */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
>>>>
```

---

## 4. Chat Auto-Scroll Bug (`src/components/CommandTerminal.tsx`)

### Observation
Inside `src/components/CommandTerminal.tsx`, auto-scroll is triggered by the following `useEffect` hook (lines 20-22):
```tsx
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
```
The browser's native `scrollIntoView()` scrolls the *entire page viewport* to align the targeted element, causing the window to jump whenever the user types (if the container size shifts) or when a message is added/updated.

### Analysis & Proposal
To fix this scroll jumping behavior, scrolling should be confined directly to the terminal container itself.
1. Reference the scrollable container `.terminal-body` by adding a React ref `terminalBodyRef` to it.
2. Inside `useEffect`, scroll the `.terminal-body` element to its `scrollHeight` using `.scrollTo({ top: ..., behavior: 'smooth' })`.
3. Remove `endOfMessagesRef` and its placeholder div to clean up the DOM.

### Proposed Modification
```tsx
<<<<
const CommandTerminal = ({ messages, onSendMessage, isTyping }: CommandTerminalProps) => {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#ff5f56' }} />
        <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
        <div className="terminal-dot" style={{ background: '#27c93f' }} />
        <span className="terminal-title">AI_AUDITOR.exe</span>
      </div>
      
      <div className="terminal-body">
        <AnimatePresence initial={false}>
          {messages.filter(m => m.role !== 'system').map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`terminal-message ${msg.role}`}
            >
              <span className="terminal-prompt">
                {msg.role === 'assistant' ? 'AI_SYSTEM> ' : 'USER> '}
              </span>
              <span className="terminal-content">{msg.content}</span>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="terminal-message assistant"
            >
              <span className="terminal-prompt">AI_SYSTEM&gt; </span>
              <span className="terminal-typing-indicator">...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>
====
const CommandTerminal = ({ messages, onSendMessage, isTyping }: CommandTerminalProps) => {
  const [input, setInput] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#ff5f56' }} />
        <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
        <div className="terminal-dot" style={{ background: '#27c93f' }} />
        <span className="terminal-title">AI_AUDITOR.exe</span>
      </div>
      
      <div className="terminal-body" ref={terminalBodyRef}>
        <AnimatePresence initial={false}>
          {messages.filter(m => m.role !== 'system').map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`terminal-message ${msg.role}`}
            >
              <span className="terminal-prompt">
                {msg.role === 'assistant' ? 'AI_SYSTEM> ' : 'USER> '}
              </span>
              <span className="terminal-content">{msg.content}</span>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="terminal-message assistant"
            >
              <span className="terminal-prompt">AI_SYSTEM&gt; </span>
              <span className="terminal-typing-indicator">...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
>>>>
```
