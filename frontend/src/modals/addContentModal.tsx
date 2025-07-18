import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';

interface Tag {
  _id: string;
  title: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentAdded: () => void;
}

const AddContentModal = ({ isOpen, onClose, onContentAdded }: AddContentModalProps) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [contentType, setContentType] = useState<'link' | 'pdf'>('link');
  const [uploading, setUploading] = useState(false);

  // Fetch existing tags from backend when modal opens
  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tags`, {
        credentials: 'include',
      });
      const data = await res.json();
      setTags(data.tags || []);
    };

    if (isOpen) fetchTags();
  }, [isOpen]);

  // Handle content submission
  const handleSubmit = async () => {
    if (!title) return toast.error('Please provide a title');
    if (contentType === 'pdf' && !pdfFile) return toast.error('Please select a PDF');
    if (contentType === 'link' && !link) return toast.error('Please enter a link');

    try {
      setUploading(true);

      let res;

      if (contentType === 'pdf') {
         
        const formData = new FormData();
        formData.append('title', title);
        formData.append('contentType', 'pdf');
        formData.append('tags', JSON.stringify(selectedTags));
        formData.append('pdf', pdfFile!);

        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addContent`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      } else {
        // Send JSON body for link
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title,
            link,
           tags: selectedTags,
           contentType: 'link',
          }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        toast.success('Content added successfully!');
        // Reset state
        setTitle('');
        setLink('');
        setPdfFile(null);
        setSelectedTags([]);
        onClose();
        onContentAdded();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Internal error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg w-[30vw] mx-auto mt-[15vh] shadow-md outline-none"
    >
      <h2 className="text-xl font-bold mb-4">Add Content</h2>

      {/* Toggle: PDF or Link */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${contentType === 'link' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setContentType('link')}
        >
          Link
        </button>
        <button
          className={`px-4 py-2 rounded ${contentType === 'pdf' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setContentType('pdf')}
        >
          PDF
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
      />

      {/* Conditional input: Link or PDF */}
      {contentType === 'link' ? (
        <input
          type="text"
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
      ) : (
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="w-full mb-3"
        />
      )}

      {/* Tag input with dynamic creation */}
      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium">Tags (create or select)</label>
        <input
          type="text"
          placeholder="Type and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = (e.target as HTMLInputElement).value.trim().toLowerCase();
              if (value && !selectedTags.includes(value)) {
                setSelectedTags((prev) => [...prev, value]);
              }
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Suggestion list */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {tags
            .filter((tag) => !selectedTags.includes(tag.title))
            .map((tag) => (
              <button
                key={tag._id}
                onClick={() => setSelectedTags((prev) => [...prev, tag.title])}
                className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-700 border"
              >
                + #{tag.title}
              </button>
            ))}
        </div>

        {/* Selected tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-sm rounded-full bg-purple-600 text-white flex items-center gap-1"
            >
              #{tag}
              <button
                onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                className="ml-1 text-white hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-700">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-4 py-2 rounded bg-purple-600 text-white"
        >
          {uploading ? 'Uploading...' : 'Add'}
        </button>
      </div>
    </Modal>
  );
};

export default AddContentModal;
