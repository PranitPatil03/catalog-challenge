const Chart = () => {
  return (
    <div className="flex justify-between items-center">
      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
        Fullscreen
      </button>
      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
        Compare
      </button>
      <div className="flex space-x-2">
        {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((period) => (
          <button
            key={period}
            className={`px-3 py-1 rounded ${
              period === "1w"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;
