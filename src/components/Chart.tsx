import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { CirclePlus, Maximize2 } from "lucide-react";

const periodToDays: { [key: string]: number } = {
  "1d": 1,
  "3d": 3,
  "1w": 7,
  "1m": 30,
  "6m": 180,
  "1y": 365,
  max: 10000,
};

const ChartComponent = ({
  selectedPeriod,
  setSelectedPeriod,
  toggleFullscreen,
  isFullscreen,
}: {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}) => {
  return (
    <div className="flex justify-between items-center font-moderustic">
      <div className="flex space-x-2">
        <Button
          onClick={toggleFullscreen}
          className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500"
        >
          <Maximize2 className="w-6 h-6 mr-2" />
          <span className="text-lg">
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </span>
        </Button>
        <Button className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500">
          <CirclePlus className="w-6 h-6 mr-2" />
          <span className="text-lg">Compare</span>
        </Button>
      </div>

      <div className="flex space-x-2">
        {Object.keys(periodToDays).map((period) => (
          <Button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 py-1 rounded text-lg ${
              period === selectedPeriod
                ? "bg-[#4B41EF] text-white hover:bg-[#4B41EF]"
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

const Chart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1w");
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: isFullscreen ? window.innerHeight - 100 : 450,
        layout: {
          background: { color: "#fff" },
          textColor: "#000",
        },
        grid: {
          vertLines: {
            color: "#e9e7e7",
          },
          horzLines: {
            color: "#fff",
          },
        },
        timeScale: {
          visible: false,
          borderColor: "#fff",
        },
        rightPriceScale: {
          borderVisible: false,
          borderColor: "#71649C",
          entireTextOnly: true,
        },
      });

      const lineSeries = chart.addAreaSeries({
        lineColor: "#4B41EF",
        topColor: "rgba(118, 113, 207, 0.253)",
        bottomColor: "rgba(128, 123, 227, 0.024)",
        priceLineVisible: false,
      });

      chart.timeScale().applyOptions({
        borderColor: "#71649C",
        barSpacing: 10,
      });

      chart.applyOptions({
        crosshair: {
          vertLine: {
            color: "#888",
            labelBackgroundColor: "#000",
          },
          horzLine: {
            color: "#888",
            labelBackgroundColor: "#000",
          },
        },
      });

      setIsLoading(true);
      fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedPeriod}`
      )
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.prices.map((price: [number, number]) => ({
            time: Math.floor(price[0] / 1000),
            value: price[1],
          }));
          lineSeries.setData(formattedData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.resize(
            chartContainerRef.current.clientWidth,
            isFullscreen ? window.innerHeight - 100 : 450
          );
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [selectedPeriod, isFullscreen]);

  return (
    <div
      className={`p-4 rounded-lg text-white ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
    >
      <ChartComponent
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
        <div ref={chartContainerRef} className="my-5 border-b border-l"></div>
      </div>
    </div>
  );
};

export default Chart;
