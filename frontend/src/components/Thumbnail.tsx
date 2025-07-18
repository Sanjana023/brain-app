import { FileText, Twitter, Book } from 'lucide-react';

interface ThumbnailProps {
  link: string;
  title: string;
  contentType: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
}

// ✅ Extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Case 1: https://www.youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    }

    // Case 2: https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1); // remove leading '/'
    }

    return null;
  } catch (error) {
    return null; // in case of invalid URL
  }
}

const Thumbnail = ({ contentType, link, title }: ThumbnailProps) => {
  const videoId = contentType === 'Youtube' ? extractYouTubeVideoId(link) : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-full h-[150px] rounded-xl flex justify-center items-center bg-gray-100"
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      ) : contentType === 'PDF' ? (
        <FileText className="w-10 h-10 text-gray-500" />
      ) : contentType === 'Twitter' ? (
        <Twitter className="w-10 h-10 text-blue-500" />
      ) : contentType === 'Notion' ? (
        <Book className="w-10 h-10 text-black" />
      ) : null}
    </div>
  );
};

export default Thumbnail;

