import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import StatCard from '../../../shared/components/StatCard';
import { cn } from '../../../shared/utils/cn';

// Predefined questions and their mock analytical responses
const predefinedQuestions = [
  {
    id: 'q1',
    text: "Show me asset utilization by department",
    response: {
      type: 'analytics',
      text: "Here is the current asset utilization breakdown across departments. Engineering and Marketing are currently holding the highest volume of allocated assets.",
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <StatCard title="Engineering" value="450 Assets" color="indigo" trend={{ value: '+12%', direction: 'up' }} icon={TrendingUp} />
          <StatCard title="Marketing" value="340 Assets" color="emerald" trend={{ value: '+5%', direction: 'up' }} icon={TrendingUp} />
        </div>
      )
    }
  },
  {
    id: 'q2',
    text: "Which assets are due for maintenance?",
    response: {
      type: 'analytics',
      text: "I found 3 critical assets that are overdue for scheduled maintenance this week.",
      component: (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4 text-sm text-red-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={16} /> Critical Maintenance Due
          </div>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Delivery Van #4 (AST-1045) - 5 days overdue</li>
            <li>HVAC System Unit B (AST-1089) - 2 days overdue</li>
            <li>Backup Generator (AST-2001) - 1 day overdue</li>
          </ul>
        </div>
      )
    }
  },
  {
    id: 'q3',
    text: "What is the total value of available assets?",
    response: {
      type: 'analytics',
      text: "Based on the current registry, the total estimated value of unallocated (available) assets is exactly $142,500.",
      component: (
        <div className="mt-4 w-64">
          <StatCard title="Available Asset Value" value="$142,500" color="violet" icon={Database} />
        </div>
      )
    }
  }
];

const DbAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your DB Assistant. You can ask me questions about your organization's data, asset utilization, or maintenance status. Try clicking one of the suggestions below!",
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text, responseObj = null) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputValue('');

    // Simulate typing delay before assistant responds
    setTimeout(() => {
      if (responseObj) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'assistant', 
          text: responseObj.text,
          component: responseObj.component
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'assistant', 
          text: "I'm a mock DB Assistant, so I can only answer the predefined questions at the moment. Try selecting one of the suggested queries!"
        }]);
      }
    }, 600);
  };

  const handleQuestionClick = (q) => {
    handleSend(q.text, q.response);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <PageHeader 
        title="DB Assistant" 
        description="Interact with your data using natural language queries to instantly generate analytics."
      />

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-6 relative">
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-3xl",
                msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                msg.sender === 'user' ? "bg-primary-600 text-white" : "bg-indigo-100 text-primary-700"
              )}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "flex flex-col gap-2",
                msg.sender === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-5 py-3 rounded-2xl text-sm shadow-sm",
                  msg.sender === 'user' 
                    ? "bg-primary-600 text-white rounded-tr-sm" 
                    : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
                {/* Render any analytics component attached to the response */}
                {msg.component && (
                  <div className="w-full mt-2">
                    {msg.component}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined Questions */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Suggested Queries</p>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q)}
                className="text-sm px-4 py-2 bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 rounded-full transition-colors shadow-sm text-left"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex gap-4 items-center"
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your data..." 
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 focus:outline-none focus:ring-2 focus:bg-white transition-all"
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim()}
              className="px-6 py-3 h-auto"
            >
              <Send size={18} className="mr-2" />
              Ask
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DbAssistant;
