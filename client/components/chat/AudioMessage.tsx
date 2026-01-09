import React from 'react';

import { MessageItem } from '@shared/api';

import { Play } from 'lucide-react';

interface AudioMessageProps {

  message: MessageItem;

  is_outgoing: boolean;

}

export const AudioMessage: React.FC<AudioMessageProps> = ({ message, is_outgoing }) => {

  if (!message.waveform || !message.duration_formatted) return null;

  return (

    <div className={`flex items-center space-x-2 p-3 rounded-lg`}>

      <button className={`p-2 rounded-full ${is_outgoing ? 'bg-white text-blue-500 hover:bg-gray-100' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}>

        <Play size={16} />

      </button>

      <div className="flex items-end space-x-1 flex-1 min-w-0">

        {message.waveform.map((value, index) => (

          <div

            key={index}

            className={`${is_outgoing ? 'bg-white' : 'bg-blue-400'} rounded-sm flex-shrink-0`}

            style={{ height: `${Math.max(2, (value / 255) * 20)}px`, width: '2px' }}

          />

        ))}

      </div>

      <div className="flex flex-col items-end">

        <span className={`text-sm font-medium ${is_outgoing ? 'text-white' : 'text-gray-600'}`}>{message.duration_formatted}</span>

        {message.file_size && <span className={`text-xs ${is_outgoing ? 'text-white/70' : 'text-gray-500'}`}>{message.file_size}</span>}

      </div>

    </div>

  );

};