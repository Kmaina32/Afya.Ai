'use client';

import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  audioDataUri: string;
  onEnded: () => void;
}

export function AudioPlayer({ audioDataUri, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error('Audio play failed:', e));
    }
  }, [audioDataUri]);

  return (
    <audio
      ref={audioRef}
      src={audioDataUri}
      onEnded={onEnded}
      hidden
    />
  );
}
