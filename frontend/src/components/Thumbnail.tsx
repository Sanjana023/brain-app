import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ThumbnailProps {
  link: string;
  title: string;
  icon: string;
  contentType: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
}

// ✅ Extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const Thumbnail = ({ icon, link, title }: ThumbnailProps) => {
  const videoId = extractYouTubeVideoId(link);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : icon;

  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {!imgError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="rounded-xl w-full h-[150px] object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-[150px] bg-gray-200 rounded-xl">
          <ImageOff className="w-10 h-10 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Thumbnail;