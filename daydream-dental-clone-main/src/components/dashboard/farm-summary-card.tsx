export default function FarmSummaryCard() {
  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-[#1a4d4d] mb-6">Farm Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Acres */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Acres</p>
          <p className="text-4xl font-bold text-[#1a4d4d]">640</p>
        </div>
        
        {/* Number of Plots */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Number of Plots</p>
          <p className="text-4xl font-bold text-[#1a4d4d]">4</p>
        </div>
        
        {/* Overall Health */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Overall Health</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-green-600">Good</span>
          </div>
        </div>
        
        {/* Average NDVI */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Average NDVI</p>
          <p className="text-4xl font-bold text-[#5fb574]">0.56</p>
        </div>
      </div>
    </div>
  );
}