import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Upload, Sparkles, Loader2, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your elite AI Business Analyst. Ask me anything about your data, metrics, or request predictions. (Try: *'Why did revenue drop in Q3?'*)"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: newMsgId, role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "I'm having trouble connecting to the analytics engine right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] relative">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">AI Analytics</h1>
        <p className="text-muted-foreground text-sm">Have a conversation with your datasets.</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass-panel rounded-3xl border border-glass-border flex flex-col overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-white/10'}`}>
                  {msg.role === 'user' ? <span className="text-xs font-bold">AW</span> : <Bot className="w-4 h-4 text-accent" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary/20 text-white rounded-tr-sm border border-primary/20' : 'bg-white/5 text-slate-200 rounded-tl-sm border border-white/5'} prose prose-invert max-w-none`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="markdown-body">
                       <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/50 backdrop-blur-xl border-t border-glass-border">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <button type="button" className="absolute left-4 p-2 text-muted-foreground hover:text-white transition-colors disabled:opacity-50">
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about revenue, metrics, anomalies..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-14 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 bg-gradient-to-r from-primary to-accent text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
