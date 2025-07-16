import Button from "./Button";
import { Share2, Plus } from "lucide-react";

const TopBar = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 gap-4 sm:gap-0 border-b bg-white w-full">
      
      {/* Left Section: Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
        All Notes
      </h2>

      {/* Right Section: Buttons */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <Button
          variant="secondary"
          size="lg"
          text="Share Brain"
          startIcon={<Share2 className="w-4 h-4" />}
          onClick={() => console.log("Share clicked")}
        />
        <Button
          variant="primary"
          size="lg"
          text="Add Content"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => console.log("Add clicked")}
        />
      </div>
    </div>
  );
};

export default TopBar;
