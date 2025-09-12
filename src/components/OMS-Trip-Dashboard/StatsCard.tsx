import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center">
      <h3 className="text-gray-500 dark:text-gray-300 text-sm">{title}</h3>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

export default StatsCard;
