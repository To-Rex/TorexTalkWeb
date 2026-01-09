import React, { useState, useRef, useEffect } from 'react';

import { MessageItem } from '@shared/api';

import { Play, Pause, Download } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

interface AudioMessageProps {

  message: MessageItem;

  is_outgoing: boolean;

}

export const AudioMessage: React.FC<AudioMessageProps> = ({ message, is_outgoing }) => {

  if (!message.waveform || !message.duration_formatted) return null;

  const [isPlaying, setIsPlaying] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {

    const audio = audioRef.current;

    if (audio) {

      const updateTime = () => setCurrentTime(audio.currentTime);

      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);

      audio.addEventListener('loadedmetadata', updateDuration);

      audio.addEventListener('ended', () => setIsPlaying(false));

      return () => {

        audio.removeEventListener('timeupdate', updateTime);

        audio.removeEventListener('loadedmetadata', updateDuration);

        audio.removeEventListener('ended', () => setIsPlaying(false));

      };

    }

  }, []);

  const handlePlayPause = () => {

    const audio = audioRef.current;

    if (audio) {

      if (isPlaying) {

        audio.pause();

      } else {

        audio.play();

      }

      setIsPlaying(!isPlaying);

    }

  };

  const handleDownload = () => {

    if (message.file_url) {

      setIsLoading(true);

      const link = document.createElement('a');

      link.href = message.file_url;

      link.download = message.file_name || 'audio';

      link.click();

      setIsLoading(false);

    }

  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (

    <>

      <audio ref={audioRef} src={message.file_url || undefined} preload="metadata" />

      <div
        className={`p-3 rounded-lg flex flex-col space-y-3 transition-colors ${
          is_outgoing ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full flex-shrink-0 ${is_outgoing ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
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

        {message.caption && (
          <div className={`pt-2 border-t ${is_outgoing ? 'border-white/20' : 'border-gray-100'}`}>
            <p className={`text-sm ${is_outgoing ? 'text-white/90' : 'text-gray-700'}`}>{message.caption}</p>

            <div className="flex items-center space-x-3 mt-3">
              <button
                onClick={handleDownload}
                disabled={isLoading}
                aria-label="Download audio"
                title="Download"
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 flex-shrink-0"
              >
                <Download size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause' : 'Play'}
                className={`p-2 rounded-full flex-shrink-0 ${is_outgoing ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm truncate">{message.file_name}</span>
                  <div className="w-full max-w-xs">
                    <Progress value={progressPercent} />
                  </div>
                  <span className="text-xs text-muted-foreground">{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>

  );

};