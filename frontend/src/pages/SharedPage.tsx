import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';

type ContentItem = {
  _id: string;
  icon?: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
  contentType: string;
  tags: { _id: string; title: string }[];
  title: string;
  link: string;
};

const SharedContent = () => {
  const { shareLink } = useParams();
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedContent = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/brain/shared/${shareLink}`
      );
      const data = await res.json();

      if (res.ok) {
        setContentList(data.content);
        setUsername(data.username || 'someone'); // username must be returned from backend
      } else {
        setError(data.message || 'Failed to fetch shared content.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading shared brain.');
    }
  };

  useEffect(() => {
    fetchSharedContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
          🧠 Welcome to {username ? `${username}'s` : 'someone’s'} Shared Brain
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Explore notes, ideas, and resources curated with care.
        </p>
        {error && (
          <p className="text-red-500 font-medium text-center mb-6">{error}</p>
        )}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] gap-6">
        {contentList.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            title={item.title}
            link={item.link}
            tags={item.tags}
            reload={() => {}}
            hideDeleteButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SharedContent;
