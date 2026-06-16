import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

interface CommandTerminalProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isTyping: boolean;
}

const cleanMessageContent = (content: string) => {
  return content
    .replace(/\[NODE:\s*\w+\]/g, '')
    .replace(/\[ANALYSIS_COMPLETE\]/g, '')
    .trim();
};

const CommandTerminal = ({ messages, onSendMessage, isTyping }: CommandTerminalProps) => {
  const [input, setInput] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping && messages.some(m => m.role === 'user')) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 30);
      return () => clearTimeout(timer);
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
              <span className="terminal-content">{cleanMessageContent(msg.content)}</span>
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

      <form onSubmit={handleSubmit} className="terminal-input-form">
        <span className="terminal-prompt">USER&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="terminal-input"
          placeholder={isTyping ? "Procesando..." : "Escribí tu mensaje..."}
        />
      </form>
    </div>
  );
};

export default CommandTerminal;
