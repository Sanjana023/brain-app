import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Thumbnail from './Thumbnail';
import { motion } from 'framer-motion';

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
}

const getContentType = (link: string): 'Youtube' | 'Twitter' | 'Notion' | 'PDF' => {
  if (link.includes('youtube.com') || link.includes('youtu.be')) return 'Youtube';
  if (link.includes('twitter.com')) return 'Twitter';
  if (link.includes('notion.so')) return 'Notion';
  return 'PDF';
};

const Card = ({ id, tags, title, link, reload }: CardProps) => {
  const date = format(new Date(), 'dd/MM/yyyy');
  const contentType = getContentType(link);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

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
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97, rotate: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="bg-white rounded-2xl shadow-md p-4 w-[240px] h-[340px] flex flex-col justify-between hover:shadow-xl cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-sm font-semibold text-gray-800 truncate max-w-[85%]">{title}</h2>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Thumbnail */}
      <div className="rounded-lg overflow-hidden bg-gray-100 h-[130px] flex items-center justify-center mb-3">
        <Thumbnail link={link} contentType={contentType} title={title} />
      </div>

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
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
      <div className="text-xs text-gray-500 mt-auto">
        Added on <span className="font-medium text-gray-600">{date}</span>
      </div>
    </motion.div>
  );
};

export default Card;