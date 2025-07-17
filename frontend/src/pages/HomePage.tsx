import { useEffect, useState } from 'react';
import Card from '../components/Card';
import SideBar from '../layouts/SideBar';
import Topbar from '../layouts/Topbar';

type ContentItem = {
  _id: string;
  icon?: "Youtube" | "Twitter" | "Notion" | "PDF";
  contentType: string;  
  tag: "Productivity" | "Tech & Tools" | "Mindset" | "Learning & Skills" | "Workflows" | "Inspiration";
  title: string;
  link: string;
};

const HomePage = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);

  const fetchContent = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/content`, {
      credentials: 'include',
    });
    const data = await res.json();
   if (res.ok && Array.isArray(data.contents)) {
    setContentList(data.contents); // ✅ extract the contents array
  } else {
    setContentList([]); // fallback
  }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 space-y-6 flex flex-wrap gap-6">
          {contentList.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              icon={item.contentType === 'pdf' ? 'PDF' : item.icon}
              tag={item.tag}
              title={item.title}
              link={item.link}
              reload={fetchContent}  
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
