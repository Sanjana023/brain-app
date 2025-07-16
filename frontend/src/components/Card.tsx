// components/Card.tsx
import { format } from 'date-fns';
//import { useNavigate } from 'react-router-dom';
import { FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Thumbnail from './Thumbnail';

interface CardProps {
  id: string;
  icon?: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
  tag:
    | 'Productivity'
    | 'Tech & Tools'
    | 'Mindset'
    | 'Learning & Skills'
    | 'Workflows'
    | 'Inspiration';
  title: string;
  link: string;
  reload: () => void;
}

const Card = ({ icon= 'PDF', tag, title, link, reload, id }: CardProps) => {
  //const navigate = useNavigate();
  const date = format(new Date(), 'dd/MM/yyyy');

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
       toast.success('Item deleted successfully!');
        reload();
      } else {
       toast.error('Failed to delete the item');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-[19vw] h-[50vh] flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <FileText size={18} />
          <h2 className="text-md font-semibold">{title}</h2>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Thumbnail */}
      <Thumbnail icon={icon} link={link} title={title} />

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
