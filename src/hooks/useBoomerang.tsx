import { useState, useEffect } from 'react';

function useBoomerang(initialValue = 0.001, step = 0.001, max = 2, min = 0.001) {
  const [value, setValue] = useState(initialValue);
  const [direction, setDirection] = useState(1); // 1 for increment, -1 for decrement

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => {
        // Calculate the next value based on direction
        const nextValue = prevValue + step * direction;

        // Check if the value exceeds limits
        if (nextValue >= max) {
          setDirection(-1); // Switch to decrement
          return max;
        } else if (nextValue <= min) {
          setDirection(1); // Switch to increment
          return min;
        }

        return nextValue;
      });
    }, 2);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [step, max, min, direction]);

  return value;
}

export default useBoomerang;