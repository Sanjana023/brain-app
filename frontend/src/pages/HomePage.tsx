import { useEffect, useState } from 'react';
import Card from '../components/Card';
import SideBar from '../layouts/SideBar';
import Topbar from '../layouts/Topbar';
import AddContentModal from '../modals/addContentModal';

type ContentItem = {
  _id: string;
  icon?: 'Youtube' | 'Twitter' | 'Notion' | 'PDF';
  contentType: string;
  tags: { _id: string; title: string }[];
  title: string;
  link: string;
};

const HomePage = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContent = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/content`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.contents)) {
      setContentList(data.contents);
    } else {
      setContentList([]);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAddContentClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200  to-white-200">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Topbar onAddContentClick={handleAddContentClick} />

        <AddContentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContentAdded={fetchContent}
        />
        <div className="px-6 py-4">
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] gap-6">
            {contentList.map((item) => (
              <Card
                key={item._id}
                id={item._id}
                tags={item.tags}
                title={item.title}
                link={item.link}
                reload={fetchContent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
