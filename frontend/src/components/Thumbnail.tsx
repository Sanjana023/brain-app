// components/Thumbnail.tsx
import {useEffect, useState } from 'react';
import type { FC } from 'react';
import { Twitter, FileDown, BookCopy } from 'lucide-react';

interface ThumbnailProps {
  icon: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
  link: string;
  title: string;
}

const Thumbnail: FC<ThumbnailProps> = ({ icon, link, title }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const getYoutubeId = (url: string): string | null => {
    const regularFormat = url.split('v=');
    if (regularFormat.length > 1) return regularFormat[1].split('&')[0];
    const shortFormat = url.split('youtu.be/');
    if (shortFormat.length > 1) return shortFormat[1].split('?')[0];
    return null;
  };

  useEffect(() => {
    if (icon === 'Youtube') {
      const id = getYoutubeId(link);
      if (id) setThumbnail(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
    } else if (icon === 'PDF') {
      setThumbnail('/pdf-preview.png'); // fallback or placeholder
    }
  }, [link, icon]);

  return (
    <div className="w-full h-36 bg-purple-50 rounded-md overflow-hidden flex justify-center items-center">
      {icon === 'Youtube' && thumbnail && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="w-full h-full">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </a>
      )}

      {icon === 'PDF' && thumbnail && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-600">
          <FileDown size={40} />
        </a>
      )}

      {icon === 'Twitter' && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-600">
          <Twitter size={40} />
        </a>
      )}

      {icon === 'Notion' && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-600">
          <BookCopy size={40} />
        </a>
      )}

      {!thumbnail && icon === 'Youtube' && (
        <span className="text-gray-400 text-sm">No thumbnail available</span>
      )}
    </div>
  );
};

export default Thumbnail;
