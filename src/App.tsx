import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getRandomColors } from "./classes/ColorGenerator";

const renderImage = (context: CanvasRenderingContext2D | null, imageUrl: string, x:number, y:number, dx: number, dy: number) => {
  if (context) {
    // Create an image element
    const img = new Image();

    // Set the source of the image to the provided URL
    img.src = imageUrl;


    // When the image is loaded, draw it on the canvas
    // img.onload = () => {
    //     context.drawImage(img, x, y, dx, dy);
    // };

    const animate = () => {
      // Draw the image at the current position
      context.drawImage(img, x, y, dx,dy);

      // Update the position for the next frame
      x += 2; // Adjust the value based on your desired speed
    }
      // Request the next animation frame
      requestAnimationFrame(animate);
    
} else {
    console.error('Unable to get 2D context for canvas.');
}
}

export interface IPosition {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

const compareNumbersWithRange = (
  num1: number,
  num2: number,
  range: number
) => num1 < num2 + range && num1 > num2 - range;

const range = 0.128;

const cellSpawner = async ({cellPositionsArray, cellsNumber, context, randomColors, dimensions}:
  {cellsNumber: number,
  context: CanvasRenderingContext2D,
  cellPositionsArray: IPosition[],
  randomColors?: { color1: string; color2: string; color3: string; },
  dimensions?: [number,number]}
) => {
  for (let i = 0; i < cellsNumber; i++) {
    // await new Promise<void>((res) => setTimeout(() => {res()}, i * 1000))

    const mainColor = "#ccc";
    const secondaryColor = "#000";
    const ternaryColor = "#f33";
    context.strokeStyle = mainColor;

    const randomX = Math.ceil(Math.random() * (dimensions?.[0] || 0 / 5 || 300));
    const randomY = Math.ceil(Math.random() * (dimensions?.[1] || 0 / 5 || 150));
    const lineFinishX = randomX % 2 === 0 ? randomX - 4 : randomX + 4;
    const lineFinishY = randomY + 4;

    if (randomX % 2 === 0) {
      context.strokeStyle = secondaryColor;
    }

    if (randomX % 3 === 0) {
      context.strokeStyle = ternaryColor;
    }

    // if (randomX % 2 === 0 || randomY % 4 === 0) {
    //   renderImage(context, 'https://www.pngall.com/wp-content/uploads/14/Thumbs-Up-Emoji-PNG-Photos.png', randomX*i, randomY*i, i,i)
    // }

    const position = {
      x1: randomX,
      x2: lineFinishX,
      y1: randomY,
      y2: lineFinishY,
    };

    if (
      cellPositionsArray.find(
        (savedPosition) =>
          (compareNumbersWithRange(savedPosition.x1, position.x1, range) &&
            compareNumbersWithRange(savedPosition.y1, position.y1, range)) ||
          (compareNumbersWithRange(savedPosition.x2, position.x2, range) &&
            compareNumbersWithRange(savedPosition.y2, position.y2, range)) ||
          (compareNumbersWithRange(savedPosition.x1, position.x2, range) &&
            compareNumbersWithRange(savedPosition.y1, position.y2, range)) ||
          (compareNumbersWithRange(savedPosition.x2, position.x1, range) &&
            compareNumbersWithRange(savedPosition.y2, position.y1, range))
      )
    ) {
      context.beginPath();
      var grd = context.createLinearGradient(0, 0, 170, 0);
      grd.addColorStop(0, randomColors?.color1 || '#fcc');
      grd.addColorStop(0.5, randomColors?.color2 || '#dcc');
      grd.addColorStop(1, randomColors?.color3 || '#fac');
      context.strokeStyle = grd;
      // context.strokeText('BEVERLY HILLS 90210', position.x1, position.y1)
      context.arc(position.x1, position.y1, 48, 320, 2 * Math.PI);
      context.stroke();
      return;
    }

    cellPositionsArray.push(position);

    context.beginPath();
    context.arc(position.x1, position.y1, 0.1, 0, 2 * Math.PI);
    context.stroke();
  }
};

function App() {
  const [gradientColors, setGradientColors] = useState<{ color1: string; color2: string; color3: string; }>()
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const cb = useCallback(() => {
    const cellPositionsArray: IPosition[] = [];
      const gameCanvas: HTMLCanvasElement = document.getElementById(
        "game"
      ) as HTMLCanvasElement;
      const context = gameCanvas?.getContext("2d");
      cellSpawner({cellsNumber: 128000, context: context as CanvasRenderingContext2D, cellPositionsArray, randomColors: gradientColors, dimensions: [windowDimensions.width, windowDimensions.height]})
  }, [gradientColors,windowDimensions])

  useEffect(() => {
    cb()
  }, [cb]);

  useEffect(() => {
    setInterval(() => setGradientColors(getRandomColors()), 0.00001)
    
  }, [])

  useEffect(() => {
    // Function to update window dimensions
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Event listener for window resize
    window.addEventListener('resize', updateWindowDimensions);

    // Call the function to set initial window dimensions
    updateWindowDimensions();

    // Cleanup: remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  return (
    <>
      <canvas width={windowDimensions.width / 5} height={windowDimensions.height / 5} id={"game"} className={"game"} />
    </>
  );
}

export default App;
