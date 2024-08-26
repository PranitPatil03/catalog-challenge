import { useState } from "react";
import Chart from "./Chart";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Chart");
  const tabs = ["Summary", "Chart", "Statistics", "Analysis", "Settings"];

  const renderContent = () => {
    switch (activeTab) {
      case "Chart":
        return <Chart />;
      case "Summary":
        return <p className="text-center py-4">Summary content here</p>;
      case "Statistics":
        return <p className="text-center py-4">Statistics content here</p>;
      case "Analysis":
        return <p className="text-center py-4">Analysis content here</p>;
      case "Settings":
        return <p className="text-center py-4">Settings content here</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full gap-6 max-w-7xl">
      <div className="flex flex-col w-full max-w-7xl h-full p-4 gap-6">
        <div className="flex flex-row items-start w-full gap-1">
          <p className="text-7xl font-semibold font-mono">63,179.43</p>
          <span className="text-gray-400 text-3xl font-medium font-mono mx-3">
            USD
          </span>
        </div>
        <div className="">
          <p className="text-xl font-medium font-mono text-green-500">
            +1,000.00 (1.62%)
          </p>
        </div>
      </div>

      <div className="w-full">
        <nav className="flex space-x-4 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-4 px-4 font-medium text-lg ${
                activeTab === tab
                  ? "border-b-4 border-indigo-500 text-indigo-600"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="my-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
