import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Thumbnail from './Thumbnail';

interface CardProps {
  id: string;
  icon?: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
  tag: string;
  title: string;
  link: string;
  reload: () => void;
}

const Card = ({ id, icon = 'PDF', tag, title, link, reload }: CardProps) => {
  const date = format(new Date(), 'dd/MM/yyyy');

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/delete/${id}`, {
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
    <div className="bg-white rounded-xl shadow-md p-4 w-[19vw] h-[50vh] flex flex-col justify-between">
      {/* Title + Delete */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-md font-semibold text-gray-800 truncate">{title}</h2>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-400 transition">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Thumbnail */}
      <Thumbnail link={link} contentType={icon} />

      {/* Tags */}
      <div className="pt-3 flex gap-2 flex-wrap">
        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
          #{tag}
        </span>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 mt-2">
        Added on <span className="font-medium text-gray-500">{date}</span>
      </div>
    </div>
  );
};

export default Card;
