import React, { useState } from 'react';
import { GiftedChat } from 'gifted-chat';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const onSend = async (newMessages = []) => {
    setMessages(previous => GiftedChat.append(previous, newMessages));
    const userMessage = newMessages[0].text;

    const response = await axios.post('/api/healthgpt', { message: userMessage });
    setMessages(previous =>
      GiftedChat.append(previous, [
        {
          _id: Math.random().toString(),
          text: response.data.reply,
          createdAt: new Date(),
          user: { _id: 2, name: 'HealthGPT' }
        }
      ])
    );
  };

  return <GiftedChat messages={messages} onSend={messages => onSend(messages)} user={{ _id: 1 }} />;
}