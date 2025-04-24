import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import axios from 'axios';

const Chatbot = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);

    try {
      const response = await axios.post('http://localhost:3003/api/chat', {
        message,
      });
      const botResponse = response.data.response;
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Error: Could not reach chatbot', sender: 'bot' },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      {isMinimized && (
        <div className="chatbot-icon" onClick={toggleMinimize}></div>
      )}
      <div className="chatbot-header" style={{ display: isMinimized ? 'none' : 'flex' }}>
        <span>Hotel Assistant</span>
        <button onClick={toggleMinimize}>
          {isMinimized ? 'Open' : '–'} {/* Minimize symbol when maximized */}
        </button>
      </div>
      <div className="chatbot-content" style={{ display: isMinimized ? 'none' : 'flex' }}>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        {!isMinimized && (
          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chatbot;