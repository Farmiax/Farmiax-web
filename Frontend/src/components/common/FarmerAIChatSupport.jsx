import React, { useState, useEffect, useRef } from 'react';
import '../../styles/farmer-ai-support.css';

const KNOWLEDGE_BASE = [
  {
    keywords: ['product', 'add', 'list', 'new item', 'upload'],
    answer: '🌾 **Adding a Product:**\n1. Go to **Products** from the sidebar.\n2. Click the **"Add New Product"** button.\n3. Fill in product name, SKU, price, stock, category & upload clear farm photos.\n4. Click **Save Product** to make it available for customer orders.'
  },
  {
    keywords: ['order', 'status', 'packed', 'delivery', 'deliver', 'ship'],
    answer: '📦 **Order Workflow:**\n• **Order Placed** → Customer paid & verified by gateway.\n• **Packed** → Mark when produce is boxed.\n• **Out for Delivery** → Handed over to logistics/delivery partner.\n• **Delivered** → Customer received fresh goods.'
  },
  {
    keywords: ['payout', 'money', 'payment', 'bank', 'earnings', 'receive', 'wallet'],
    answer: '💳 **Farmer Payouts:**\n• Earnings are recorded as soon as an order is confirmed.\n• Payouts are transferred automatically to your verified bank account once delivery is marked **Delivered** (usually within 24-48 business hours).'
  },
  {
    keywords: ['inventory', 'stock', 'low stock', 'threshold', 'restock'],
    answer: '📊 **Inventory Management:**\n• Navigate to **Inventory** in the sidebar.\n• You can edit quantities, set selling price, and enable **Auto-Restock** toggles.\n• When stock dips below your threshold (default 10 units), the system marks it as 🟡 Low Stock.'
  },
  {
    keywords: ['help', 'support', 'contact', 'call', 'agent', 'human', 'number'],
    answer: '📞 **Need Direct Assistance?**\n• Dedicated Farmer Helpline: **1800-FARMIAX (1800-327-6429)**\n• WhatsApp Support: **+91 98765 43210**\n• Email: **support@farmiax.com**\nAvailable 24/7 in English, Hindi, and regional languages.'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hello Farmer! 🌾 I am your **Farmiax AI Support Assistant**.\n\nHow can I assist you with your products, orders, inventory, or payouts today?',
    time: 'Just now'
  }
];

const QUICK_PROMPTS = [
  '🌾 How to add a new product?',
  '📦 Order status workflow',
  '💳 How do payouts work?',
  '📊 Managing low stock & inventory',
  '📞 Speak with human support'
];

const FarmerAIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Expose global window function so buttons like "Need Help" card can open this modal
  useEffect(() => {
    window.openFarmerSupportChat = () => setIsOpen(true);
    return () => {
      delete window.openFarmerSupportChat;
    };
  }, []);

  const getAIResponse = (userQuery) => {
    const lowerQuery = userQuery.toLowerCase();
    
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(kw => lowerQuery.includes(kw))) {
        return item.answer;
      }
    }

    return `🌾 **Farmiax AI Support:**\nThank you for reaching out! Regarding "${userQuery}", I have logged your request. You can manage this from your Farmer Portal, or reach our direct support team at **1800-FARMIAX**.`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const botResponseText = getAIResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Button in Bottom-Right */}
      <button 
        className="farmer-support-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Farmiax AI Support"
        aria-label="Customer Support AI Chat"
      >
        <div className="btn-icon-wrapper">
          <i className="ri-customer-service-2-fill support-icon"></i>
          <i className="ri-sparkling-fill sparkle-badge"></i>
        </div>
        <span className="btn-label">Customer Support</span>
      </button>

      {/* Interactive AI Chat Window */}
      {isOpen && (
        <div className="farmer-ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-avatar-badge">
                <i className="ri-robot-2-line"></i>
              </div>
              <div className="ai-chat-title-box">
                <h4>Farmiax AI Support</h4>
                <div className="ai-chat-status">Online • 24/7 AI Assistant</div>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button className="ai-header-btn" onClick={handleResetChat} title="Restart chat">
                <i className="ri-refresh-line"></i>
              </button>
              <button className="ai-header-btn" onClick={() => setIsOpen(false)} title="Close chat">
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-chat-msg ${msg.sender}`}>
                <div 
                  className="ai-msg-bubble"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />') 
                  }}
                />
                <span className="ai-msg-time">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="ai-typing-indicator">
                <div className="ai-typing-dot"></div>
                <div className="ai-typing-dot"></div>
                <div className="ai-typing-dot"></div>
              </div>
            )}

            {/* Quick Prompt Chips shown when few messages */}
            {messages.length <= 2 && !isTyping && (
              <div className="ai-quick-prompts">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button 
                    key={idx} 
                    className="ai-prompt-chip"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="ai-chat-input-area">
            <input 
              type="text" 
              placeholder="Ask AI for platform help or support..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <button 
              className="ai-chat-send-btn" 
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              title="Send message"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FarmerAIChatSupport;
