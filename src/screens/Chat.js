import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! I am HealthGPT, your personal health assistant. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'HealthGPT',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    try {
      const response = await fetch('/api/healthgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessages[0].text }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const { reply } = await response.json();
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'HealthGPT',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
