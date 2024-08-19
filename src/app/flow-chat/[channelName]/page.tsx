'use client';

import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import './page.css';

let channels = new Pusher('04abbc088f6af203e82c', {
  cluster: 'ap3',
});

export default function Page({ params }: { params: { channelName: string } }) {
  const [chatContent, setChatContent] = useState('');
  const [chatList, setChatList] = useState<
    {
      time: string;
      id: string;
      chat: string;
      color: string;
    }[]
  >([]);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatContent(event.target.value);
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      chat(chatContent);
    }
  };

  async function chat(_chatContent: string) {
    try {
      if (!_chatContent || 100 < _chatContent.length) {
        return;
      }
      setChatContent('');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: params.channelName,
          chatContent: _chatContent,
          color: selectedColor, // カラーを一緒に送信
        }),
      });
      if (!res.ok) {
        console.error('chat failed');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  let channel = channels.subscribe(params.channelName);
  console.log(`bind channel ${params.channelName}`);
  channel.bind('chat', function (chatData: { chat: string; color: string }) {
    console.log('flow chat received');
    console.log(`this is chat: ${chatData.chat}`);
    addChat(chatData.chat, chatData.color);
  });

  const addChat = (chat: string, color: string) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    const newChat = {
      id: uuidv4(),
      chat: chat,
      time: formattedDateTime,
      color: color,
    };
    console.log(newChat);
    setChatList([newChat, ...chatList]);
  };

  return (
    <div className="chat-container">
      <div className="chat-log" id="chatLog">
        {chatList.map((chat) => (
          <React.Fragment key={chat.id}>
            <p className="chat-content" style={{ color: chat.color }}>
              {chat.chat}
              <small> ({chat.time})</small>
            </p>
            <hr />
          </React.Fragment>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          maxLength={100}
          id="messageInput"
          placeholder="チャットを入力(Enterで送信) <100"
          value={chatContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          id="sendButton"
          onClick={() => {
            chat(chatContent);
          }}
        >
          送信
        </button>
      </div>
    </div>
  );
}
