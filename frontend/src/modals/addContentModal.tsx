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

const AddContentModal = ({
  isOpen,
  onClose,
  onContentAdded,
}: AddContentModalProps) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [contentType, setContentType] = useState<'link' | 'pdf'>('link');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tags`, {
          credentials: 'include',
        });
        const data = await res.json();
        setTags(data.tags || []);
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };

    if (isOpen) {
      fetchTags();
      setSelectedTags([]); // reset on open
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!title) return toast.error('Please provide a title');
    if (contentType === 'pdf' && !pdfFile)
      return toast.error('Please select a PDF');
    if (contentType === 'link' && !link)
      return toast.error('Please enter a link');

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
        toast.success('Content added!');
        setTitle('');
        setLink('');
        setPdfFile(null);
        setSelectedTags([]);
        onClose();
        onContentAdded();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error('Internal error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = (input: string) => {
    const tag = input.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="backdrop-blur-lg bg-white/80 border border-purple-200 p-6 rounded-lg w-[30vw] mx-auto mt-[15vh] shadow-xl"
    >
      <h2 className="text-xl font-bold mb-4">Add Content</h2>

      {/* Toggle */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            contentType === 'link'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setContentType('link')}
        >
          Link
        </button>
        <button
          className={`px-4 py-2 rounded ${
            contentType === 'pdf'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setContentType('pdf')}
        >
          PDF
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
      />

      {contentType === 'link' ? (
        <input
          type="text"
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
      ) : (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="pdfUpload"
              className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-600">
              {pdfFile ? pdfFile.name : 'No file chosen'}
            </span>
          </div>
          <input
            id="pdfUpload"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      )}

      {/* Tags */}
      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium">
          Tags (create or select)
        </label>
        <input
          type="text"
          placeholder="Type and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = (e.target as HTMLInputElement).value;
              handleAddTag(input);
              (e.target as HTMLInputElement).value = '';
            }
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {/* Suggestions */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {tags
          .filter((tag) => !selectedTags.includes(tag.title))
          .map((tag) => (
            <button
              key={tag._id}
              onClick={() => {
                if (!selectedTags.includes(tag.title)) {
                  setSelectedTags((prev) => [...prev, tag.title]);
                }
              }}
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
              onClick={() =>
                setSelectedTags((prev) => prev.filter((t) => t !== tag))
              }
              className="ml-1 text-white hover:text-gray-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700"
        >
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
