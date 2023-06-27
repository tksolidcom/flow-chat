'use client';

import Pusher from 'pusher-js';
import { v4 as uuidv4 } from 'uuid';
import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import Comment from '../../../../components/Comment';
import './page.css';

let channels = new Pusher('04abbc088f6af203e82c', {
  cluster: 'ap3',
});

export default function Page({ params }: { params: { channelName: string } }) {
  const [chatList, setChatList] = useState<{ id: string; chat: string }[]>([]);

  const addChat = (chat: string) => {
    const newChat = {
      id: uuidv4(),
      chat: chat,
      time: Date.now(),
    };
    console.log(newChat);
    setChatList([...chatList, newChat]);
  };
  const removeComment = (id: string) => {
    setChatList(chatList.filter((item) => item.id !== id));
  };

  let channel = channels.subscribe(params.channelName);
  console.log(`bind channel ${params.channelName}`);
  channel.bind('chat', function (chat: string) {
    console.log('flow chat received');
    console.log(`this is chat:${chat}`);
    console.log(chat);
    addChat(chat);
  });
  return (
    <div className="chat-container">
      {chatList.map((chat) => (
        <Comment
          key={chat.id}
          chatId={chat.id}
          text={chat.chat}
          onAnimationEnd={removeComment}
        ></Comment>
      ))}
    </div>
  );
}
