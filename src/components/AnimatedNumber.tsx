import React, { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in milliseconds
  decimals?: number;
  suffix?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 1000, decimals = 0, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1); // 0 → 1

      // Optional: ease out effect
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (value - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // ensure final value is exact
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
