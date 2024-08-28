import { Button } from "./ui/button";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
} from "lightweight-charts";
import { CirclePlus, Maximize2 } from "lucide-react";

const periodToDays: Record<string, number> = {
  "1d": 1,
  "3d": 3,
  "1w": 7,
  "1m": 30,
  "6m": 180,
  "1y": 365,
  max: 10000,
};

interface ChartComponentProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  toggleFullscreen,
  isFullscreen,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center font-moderustic gap-4">
      <div className="flex space-x-2">
        <Button
          onClick={toggleFullscreen}
          className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500"
        >
          <Maximize2 className="w-4 h-4 sm:w-6 sm:h-6 mr-2" />
          <span className="text-sm sm:text-lg">
            {isFullscreen ? "Exit" : "Fullscreen"}
          </span>
        </Button>
        <Button className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-gray-500">
          <CirclePlus className="w-4 h-4 sm:w-6 sm:h-6 mr-2" />
          <span className="text-sm sm:text-lg">Compare</span>
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {Object.keys(periodToDays).map((period) => (
          <Button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-lg ${
              period === selectedPeriod
                ? "bg-[#4B41EF] text-white hover:bg-[#4B41EF]"
                : "text-gray-500 bg-white hover:bg-white"
            }`}
          >
            {period}
          </Button>
        ))}
      </div>
    </div>
  );
};

const Chart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1w");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const chartOptions = useMemo(
    () => ({
      layout: {
        background: { color: "#fff" },
        textColor: "#000",
      },
      grid: {
        vertLines: { color: "#e9e7e7" },
        horzLines: { color: "#fff" },
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
    }),
    []
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: isFullscreen ? window.innerHeight - 100 : 400,
      ...chartOptions,
      //This is to prevent the chart from being zoomed in or out by default
      // handleScale: false,
      // handleScroll: false,
    });

    const lineSeries: ISeriesApi<"Area"> = chart.addAreaSeries({
      lineColor: "#4B41EF",
      topColor: "rgba(118, 113, 207, 0.253)",
      bottomColor: "rgba(128, 123, 227, 0.024)",
      priceLineVisible: false,
    });

    chart.priceScale("left").applyOptions({
      scaleMargins: {
        top: 0.3,
        bottom: 0.25,
      },
      entireTextOnly: true,
    });

    chart.timeScale().applyOptions({
      borderColor: "#71649C",
      barSpacing: 10,
    });

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${periodToDays[selectedPeriod]}`
        );
        const data = await response.json();
        const formattedData: LineData[] = data.prices.map(
          (price: [number, number]) => ({
            time: Math.floor(price[0] / 1000),
            value: price[1],
          })
        );
        lineSeries.setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      chart.resize(
        chartContainerRef.current!.clientWidth,
        isFullscreen ? window.innerHeight - 100 : 300
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [selectedPeriod, isFullscreen, chartOptions]);

  return (
    <div
      className={`p-2 sm:p-4 rounded-lg text-white ${
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
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
        <div
          ref={chartContainerRef}
          className="my-3 sm:my-5 border-b border-l"
        ></div>
      </div>
    </div>
  );
};

export default Chart;
