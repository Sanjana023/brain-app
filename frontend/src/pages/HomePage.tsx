import SideBar from "../layouts/SideBar";
import Topbar from "../layouts/Topbar";

const HomePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
  <SideBar />

  <div className="flex-1 flex flex-col">
    <Topbar />
    <main className="p-6 space-y-6">
      {/* Cards go here */}
    </main>
  </div>
</div>

  );
};

export default HomePage;
