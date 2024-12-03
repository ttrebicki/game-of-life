import { useState, useEffect } from 'react';

function useRGBABoomerang(initialColor = { r: 0, g: 0, b: 0, a: 0.1 }, step = 0.01, max = 100, min = 0) {
  const [color, setColor] = useState(initialColor);
  const [directions, setDirections] = useState({ r: 1, g: 1, b: 1, a: 1 }); // 1 for increment, -1 for decrement

  useEffect(() => {
    const interval = setInterval(() => {
      setColor((prevColor) => {
        const nextColor = { ...prevColor };
        const nextDirections = { ...directions };

        // Update each channel and handle direction changes
        for (const channel of ['r', 'g', 'b', 'a'] as const) {
          nextColor[channel] += step * directions[channel];

          if (nextColor[channel] >= max) {
            nextColor[channel] = max;
            nextDirections[channel] = -1;
          } else if (nextColor[channel] <= min) {
            nextColor[channel] = min;
            nextDirections[channel] = 1;
          }
        }

        setDirections(nextDirections);
        return nextColor;
      });
    }, 10); // Adjust interval as needed

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [step, max, min, directions]);

  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}

export default useRGBABoomerang;
