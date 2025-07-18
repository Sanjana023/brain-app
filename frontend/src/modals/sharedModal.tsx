// components/ShareModal.tsx
import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X, ClipboardCopy } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, link }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <DialogPanel className="bg-white rounded-xl p-6 z-50 shadow-lg w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800">Share your Brain</DialogTitle>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-red-400" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">Anyone with this link can view your shared content:</p>
        <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
          <span className="truncate text-sm">{link}</span>
          <button onClick={handleCopy}>
            <ClipboardCopy className="w-5 h-5 text-purple-600 hover:text-purple-800" />
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default ShareModal;
