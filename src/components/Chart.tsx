import { Button } from "./ui/button";
import { CirclePlus, Maximize2 } from "lucide-react";
import { useState } from "react";

const Chart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1w");

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Button className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500">
          <Maximize2 className="w-6 h-6 mr-2" />
          <span className="text-lg">Fullscreen</span>
        </Button>
        <Button className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500">
          <CirclePlus className="w-6 h-6 mr-2 " />
          <span className="text-lg">Compare</span>
        </Button>
      </div>

      <div className="flex space-x-2">
        {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((period) => (
          <Button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 py-1 rounded text-lg text-gray-500 ${
              period === selectedPeriod
                ? "bg-[#4B41EF] text-white"
                : "text-gray-500 bg-slate-50 hover:bg-slate-50"
            }`}
          >
            {period}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Chart;
