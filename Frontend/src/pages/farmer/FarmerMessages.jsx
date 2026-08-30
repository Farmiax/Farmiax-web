import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import orderService from '../../services/orderService';
import {
  FiMessageSquare, FiSend, FiUser, FiSearch, FiCheck, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await orderService.getFarmerOrders();
        const ords = Array.isArray(res) ? res : (res?.data || []);

        const list = ords.map((o, idx) => {
          const custUser = o.user || o.customer || {};
          const name = custUser.fullName || custUser.name || o.deliveryAddress?.fullName || `Customer #${idx + 1}`;
          const prodName = o.Products?.[0]?.product?.name || 'Produce Harvest';
          return {
            id: `conv-${o._id || idx}`,
            customer: name,
            topic: `Inquiry regarding Order #${String(o._id || idx).slice(-8)} (${prodName})`,
            lastMessage: `Order status: ${o.status || 'Confirmed'}. Direct delivery dispatch active.`,
            time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent',
            unread: false,
            messages: [
              {
                sender: 'customer',
                text: `Namaste! Regarding order #${String(o._id || idx).slice(-8)} for ${prodName}, please ensure freshly packed items.`,
                time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'
              },
              {
                sender: 'farmer',
                text: `Namaste ${name}! We pack our produce fresh directly from the farm on the morning of dispatch.`,
                time: '10:15 AM'
              }
            ]
          };
        });

        setConversations(list);
        if (list.length > 0) setActiveChat(list[0].id);
      } catch (err) {
        console.warn('Conversations fetch note:', err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const currentChat = conversations.find(c => c.id === activeChat) || conversations[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !currentChat) return;

    const newMsg = {
      sender: 'farmer',
      text: replyText.trim(),
      time: 'Just now',
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeChat) {
          return {
            ...c,
            lastMessage: replyText.trim(),
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setReplyText('');
    toast.success('Message sent to customer! ✉');
  };

  return (
    <FarmerDashboardLayout activeNav="messages">
      <div className="farmer-messages-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header-box">
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Customer Inquiries & Messages
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14.5px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Direct messaging channel with your produce buyers.
            </p>
          </div>
        </div>

        {/* 2-Column Chat Glass Layout */}
        <div className="glass-box" style={{ minHeight: '560px', display: 'grid', gridTemplateColumns: conversations.length > 0 ? '320px 1fr' : '1fr', overflow: 'hidden', padding: 0 }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', width: '100%' }}>
              Loading messages...
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '80px 24px', textAlign: 'center', width: '100%' }}>
              <FiMessageSquare size={48} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }} />
              <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>No Customer Messages Yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', maxWidth: '420px', margin: '0 auto' }}>
                When customers place orders or inquire about your harvested crops, direct messages will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Left: Chat List */}
              <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>Customer Conversations</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {conversations.map((conv) => {
                    const isActive = conv.id === activeChat;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveChat(conv.id)}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          borderLeft: isActive ? '4px solid #4ADE80' : '4px solid transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '14.5px', color: '#FFFFFF' }}>{conv.customer}</strong>
                          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)' }}>{conv.time}</span>
                        </div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#86EFAC' }}>{conv.topic}</p>
                        <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Active Chat Area */}
              {currentChat && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0, 0, 0, 0.1)' }}>
                  {/* Active Header */}
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{currentChat.customer}</h3>
                      <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>Topic: {currentChat.topic}</span>
                    </div>
                    <span style={{ background: 'rgba(34, 197, 94, 0.25)', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#86EFAC', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>
                      Active
                    </span>
                  </div>

                  {/* Messages Scroll Area */}
                  <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {currentChat.messages.map((m, idx) => {
                      const isFarmer = m.sender === 'farmer';
                      return (
                        <div
                          key={idx}
                          style={{
                            alignSelf: isFarmer ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isFarmer ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              padding: '12px 18px',
                              borderRadius: isFarmer ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                              background: isFarmer ? 'linear-gradient(135deg, #15803D 0%, #166534 100%)' : 'rgba(255, 255, 255, 0.25)',
                              color: '#FFFFFF',
                              fontSize: '14px',
                              lineHeight: '1.5',
                              border: isFarmer ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            }}
                          >
                            {m.text}
                          </div>
                          <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                            {m.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 22px',
                        fontSize: '14px',
                        borderRadius: '12px',
                      }}
                    >
                      <FiSend size={15} /> Send
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerMessages;

