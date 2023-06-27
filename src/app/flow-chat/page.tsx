'use client';

import { useRouter } from 'next/navigation';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [channelName, setChannelName] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelName(event.target.value);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      enter();
    }
  };
  const enter = () => {
    router.push(`/flow-chat/${channelName}`);
  };

  return (
    <div>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        value={channelName}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={enter}>enter</button>
    </div>
  );
}
