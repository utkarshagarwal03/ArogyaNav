import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Navigation, Sparkles, User } from 'lucide-react';
import { processAiQuery } from '../data/aiKnowledgeBase';

export default function AiChatbot({ onSelectDestination, currentLocation }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [messages, setMessages]   = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am **Navi AI**, your smart hospital assistant. 🏥\n\nHow can I help you today? You can describe your symptoms or ask for any department.",
      suggestions: ["Where is Pharmacy?", "I have a severe headache", "Visiting hours", "Find Emergency Care"],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  function handleSend(textToSend) {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processAiQuery(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        targetDepartment: response.targetDepartment,
        suggestions: response.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  }

  function handleNavigateClick(dept) {
    if (onSelectDestination) {
      onSelectDestination(dept);
      setIsOpen(false);
    }
  }

  // Simple Markdown bold / bullet formatter for bot responses
  function renderFormattedText(text) {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} style={{ display: 'block', marginBottom: line ? 4 : 8 }}>
          {formattedParts}
        </span>
      );
    });
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          className="ai-launcher-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <div className="ai-badge">
            <Sparkles size={12} color="#fff" />
          </div>
          <Bot size={26} color="#fff" />
          <span className="ai-launcher-label">Ask AI</span>
        </button>
      )}

      {/* Slide-Up Chat Sheet / Modal */}
      {isOpen && (
        <div className="ai-chat-backdrop" onClick={() => setIsOpen(false)}>
          <div className="ai-chat-modal" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="ai-chat-header">
              <div className="ai-header-brand">
                <div className="ai-avatar">
                  <Bot size={22} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Navi AI Assistant</h3>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
                    {currentLocation ? `📍 Current: ${currentLocation.name}` : 'Smart Hospital Navigator'}
                  </p>
                </div>
              </div>
              <button
                className="ai-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
              >
                <X size={20} color="#fff" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="ai-chat-body">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-msg-row ${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <div className="ai-msg-avatar bot">
                      <Bot size={14} color="#fff" />
                    </div>
                  )}

                  <div className="ai-msg-content">
                    <div className={`ai-bubble ${msg.sender}`}>
                      {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                    </div>

                    {/* Target Department One-Tap Action Button */}
                    {msg.targetDepartment && (
                      <button
                        className="ai-action-nav-btn"
                        onClick={() => handleNavigateClick(msg.targetDepartment)}
                      >
                        <Navigation size={16} />
                        Navigate to {msg.targetDepartment.name}
                      </button>
                    )}

                    {/* Quick Suggestion Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="ai-suggestions-list">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            className="ai-sug-chip"
                            onClick={() => handleSend(sug)}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="ai-msg-time">{msg.time}</span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="ai-msg-avatar user">
                      <User size={14} color="#fff" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="ai-msg-row bot">
                  <div className="ai-msg-avatar bot">
                    <Bot size={14} color="#fff" />
                  </div>
                  <div className="ai-bubble bot typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              className="ai-chat-footer"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="ai-chat-input"
                placeholder="Ask Navi AI (e.g. 'Where is Pharmacy?', symptoms...)"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={!inputText.trim()}
                aria-label="Send Message"
              >
                <Send size={18} color="#fff" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}

