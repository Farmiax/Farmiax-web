import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import {
  FiMessageSquare, FiSend, FiUser, FiSearch, FiCheck, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerMessages = () => {
  const [activeChat, setActiveChat] = useState('chat-1');
  const [replyText, setReplyText] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 'chat-1',
      customer: 'Ananya Sharma',
      topic: 'Salem Turmeric Storage Query',
      lastMessage: 'Thank you! Storing in glass jar as advised.',
      time: '10:45 AM',
      unread: false,
      messages: [
        { sender: 'customer', text: 'Namaste Ramesh ji! How should I store the 2kg turmeric bag to retain its natural aroma for 6 months?', time: '10:30 AM' },
        { sender: 'farmer', text: 'Namaste Ananya ji! Transfer the powder to a dry, airtight glass container away from direct sunlight. It will retain full aroma and curcumin potency for over 12 months.', time: '10:40 AM' },
        { sender: 'customer', text: 'Thank you! Storing in glass jar as advised.', time: '10:45 AM' },
      ]
    },
    {
      id: 'chat-2',
      customer: 'Karthik Raja',
      topic: 'Next Sona Masoori Harvest Date',
      lastMessage: 'Will order 10kg as soon as listed!',
      time: 'Yesterday',
      unread: false,
      messages: [
        { sender: 'customer', text: 'Hello! When is the next freshly milled batch of Sona Masoori rice arriving?', time: 'Yesterday 3:15 PM' },
        { sender: 'farmer', text: 'Hello Karthik! The new harvest is currently sun-drying. It will be milled and listed on Farmiax this upcoming Friday morning.', time: 'Yesterday 4:00 PM' },
        { sender: 'customer', text: 'Will order 10kg as soon as listed!', time: 'Yesterday 4:05 PM' },
      ]
    },
    {
      id: 'chat-3',
      customer: 'Dr. Meenakshi',
      topic: 'Bulk Honey Order for Wellness Center',
      lastMessage: 'Please let me know if 10kg can be dispatched together.',
      time: '2 days ago',
      unread: true,
      messages: [
        { sender: 'customer', text: 'Namaste! We require 10kg of raw forest honey for our traditional wellness center. Can this be dispatched in single packaging?', time: '2 days ago' },
      ]
    }
  ]);

  const currentChat = conversations.find(c => c.id === activeChat) || conversations[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

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
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Customer Inquiries & Messages
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Direct messaging channel with your produce buyers.
          </p>
        </div>

        {/* 2-Column Chat Glass Layout */}
        <div className="glass-box" style={{ height: '620px', display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden', padding: 0 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0, 0, 0, 0.1)' }}>
            {/* Active Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{currentChat.customer}</h3>
                <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>Topic: {currentChat.topic}</span>
              </div>
              <span style={{ background: 'rgba(34, 197, 94, 0.25)', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#86EFAC', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>
                Active Chat
              </span>
            </div>

            {/* Messages Thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        borderRadius: '16px',
                        background: isFarmer ? 'linear-gradient(135deg, #15803D 0%, #166534 100%)' : 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', padding: '0 4px' }}>
                      {m.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendReply} style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Type your reply to customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 22px', fontSize: '14px', borderRadius: '12px' }}
              >
                <FiSend size={15} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerMessages;
