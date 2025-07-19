import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Thumbnail from './Thumbnail';

interface Tag {
  _id: string;
  title: string;
}

interface CardProps {
  id: string;
  tags: Tag[];
  title: string;
  link: string;
  reload: () => void;
  hideDeleteButton?: boolean;
}

const getContentType = (
  link: string
): 'Youtube' | 'Twitter' | 'Notion' | 'PDF' => {
  if (link.includes('youtube.com') || link.includes('youtu.be'))
    return 'Youtube';
  if (link.includes('twitter.com')) return 'Twitter';
  if (link.includes('notion.so')) return 'Notion';
  return 'PDF';
};

const Card = ({
  id,
  tags,
  title,
  link,
  reload,
  hideDeleteButton,
}: CardProps) => {
  const date = format(new Date(), 'dd/MM/yyyy');
  const contentType = getContentType(link);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (res.ok) {
        toast.success('Item deleted!');
        reload();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-[19vw] h-[50vh] flex flex-col justify-between m-3 transition duration-300 transform hover:scale-[1.02] hover:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-md font-semibold text-gray-800 truncate">
          {title}
        </h2>
        {!hideDeleteButton && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 transition"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Thumbnail */}
      <Thumbnail link={link} contentType={contentType} title={title} />

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="pt-3 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium"
            >
              #{tag.title}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-400 mt-2">
        Added on <span className="font-medium text-gray-500">{date}</span>
      </div>
    </div>
  );
};

export default Card;
