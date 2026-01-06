import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface VideoNotePlayerProps {
  src: string;
}

export default function VideoNotePlayer({ src }: VideoNotePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // Pause other videos
      window.dispatchEvent(new CustomEvent('pauseAllVideoNotes'));
      video.muted = false; // Unmute when user plays
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handlePauseAll = () => {
      const video = videoRef.current;
      if (video && isPlaying) {
        video.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('pauseAllVideoNotes', handlePauseAll);
    return () => window.removeEventListener('pauseAllVideoNotes', handlePauseAll);
  }, [isPlaying]);

  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full rounded-full object-cover"
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-white" />
        ) : (
          <Play className="h-8 w-8 text-white" />
        )}
      </button>
    </div>
  );
}