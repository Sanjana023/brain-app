import React from 'react';
import { FileText, Video, Link, Tag, Brain } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white shadow-md p-6 gap-6">
  {/* Logo */}
  <div className="flex items-center gap-2 text-xl font-bold text-purple-700">
    <Brain className="w-6 h-6" />
    Second Brain
  </div>

  {/* Menu */}
  <nav className="flex flex-col gap-2 text-gray-700 text-base">
    <SidebarItem icon={<Video className="w-5 h-5" />} label="Videos" />
    <SidebarItem icon={<FileText className="w-5 h-5" />} label="Documents" />
    <SidebarItem icon={<Link className="w-5 h-5" />} label="Links" />
    <SidebarItem icon={<Tag className="w-5 h-5" />} label="Tags" />
  </nav>
</aside>

  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ icon, label }: SidebarItemProps) => {
  return (
    <div className="flex items-center gap-3 hover:bg-purple-50 px-3 py-2 rounded-lg cursor-pointer transition-all">
      <span className="text-purple-700">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
