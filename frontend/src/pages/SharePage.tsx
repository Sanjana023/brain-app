import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Tag {
  _id: string;
  name: string;
}

interface Content {
  _id: string;
  title: string;
  thumbnail: string;
  tags: Tag[];
  createdAt: string;
}

const SharedContent: React.FC = () => {
  const { shareLink } = useParams();
  const [sharedContent, setSharedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/brain/shared/${shareLink}`);
        const data = await res.json();

        if (res.ok) {
          setSharedContent(data.content);
        } else {
          setError(data.message || 'Error fetching shared content');
        }
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShared();
  }, [shareLink]);

  if (loading) return <div className="p-4 text-center">Loading shared content...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-purple-700">Shared Brain Content</h1>
      <div className="flex flex-wrap gap-4">
        {sharedContent.map((content) => (
          <div
            key={content._id}
            className="bg-white rounded-xl shadow-md p-4 w-[19vw] h-[50vh] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-md font-semibold text-gray-800 truncate mb-2">{content.title}</h2>
              <img
                src={content.thumbnail}
                alt="thumbnail"
                className="rounded-md w-full h-[120px] object-cover mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Added on {new Date(content.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedContent;
