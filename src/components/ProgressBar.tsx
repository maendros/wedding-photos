import React from "react";

interface ProgressBarProps {
  progress: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => (
  <span className="flex items-center gap-x-3 whitespace-nowrap">
    <div className="flex w-full h-2 bg-gray-400 rounded-full overflow-hidden">
      <div
        className={`flex flex-col justify-center rounded-full overflow-hidden ${color} text-xs text-white text-center transition duration-500`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <div className="w-6 text-end">
      <span className="text-sm text-gray-800">{progress}%</span>
    </div>
  </span>
);
export default ProgressBar;
