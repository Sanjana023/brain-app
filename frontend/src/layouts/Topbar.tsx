// TopBar.tsx
import Button from '../components/Button';
import { Share2, Plus } from 'lucide-react';

interface TopBarProps {
  onAddContentClick: () => void;
  onShareClick: () => void;
}

const TopBar = ({ onAddContentClick, onShareClick }: TopBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-4 sm:px-6 py-4 shadow-sm rounded-b-xl gap-4 sm:gap-0">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
        All Notes
      </h2>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <Button
          variant="secondary"
          size="lg"
          text="Share Brain"
          startIcon={<Share2 className="w-4 h-4" />}
          onClick={onShareClick}  
        />
        <Button
          variant="primary"
          size="lg"
          text="Add Content"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={onAddContentClick}  
        />
      </div>
    </div>
  );
};

export default TopBar;
