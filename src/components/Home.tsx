import { useState, useEffect } from "react";
import Chart from "./Chart";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Chart");
  const tabs = ["Summary", "Chart", "Statistics", "Analysis", "Settings"];
  const [bitcoinData, setBitcoinData] = useState({
    price: 0,
    change: 0,
    changePercentage: 0,
  });

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        console.log("Fetching Bitcoin data...");
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received data:", data);
        const currentPrice = data.bitcoin.usd;
        const changePercentage = data.bitcoin.usd_24h_change;
        const change = (currentPrice * changePercentage) / 100;

        console.log("Processed data:", {
          currentPrice,
          changePercentage,
          change,
        });
        setBitcoinData({
          price: currentPrice,
          change: change,
          changePercentage: changePercentage,
        });
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
        setBitcoinData({
          price: 0,
          change: 0,
          changePercentage: 0,
        });
      }
    };

    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 60000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Chart":
        return <Chart />;
      case "Summary":
        return <p className="text-center py-4">Statistics content here</p>;
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
    <div className="flex flex-col items-center justify-between w-full gap-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col w-full h-full gap-2 sm:gap-4">
        <div className="flex flex-wrap w-full gap-1">
          <p className="text-4xl sm:text-5xl md:text-7xl font-semibold font-moderustic">
            {bitcoinData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <span className="text-gray-400 text-xl sm:text-2xl md:text-3xl font-medium font-moderustic">
            USD
          </span>
        </div>
        <div>
          <p
            className={`text-lg sm:text-xl font-medium font-moderustic ${
              bitcoinData.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {bitcoinData.change >= 0 ? "+" : "-"}
            {Math.abs(bitcoinData.change).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ({bitcoinData.changePercentage.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="w-full">
        <nav className="flex overflow-x-auto border-b mb-2 sm:mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-3 sm:py-4 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
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

        <div className="my-4 sm:my-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
