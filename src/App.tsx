import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getRandomColors } from "./classes/ColorGenerator";
import useBoomerang from "./hooks/useBoomerang";
import useRGBABoomerang from "./hooks/useRGBABoomerang";

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

const range = 4;

const cellSpawner = async ({cellPositionsArray, cellsNumber, context, strokeRadius, randomColors, dimensions, mainColor = "#55c", secondaryColor = "#14e", ternaryColor = "#55ffcc"}:
  {cellsNumber: number,
    strokeRadius: number,
  context: CanvasRenderingContext2D,
  cellPositionsArray: IPosition[],
  randomColors?: { color1: string; color2: string; color3: string; },
  dimensions?: [number,number]
mainColor?: string, secondaryColor?: string, ternaryColor?: string}
) => {
  for (let i = 0; i < cellsNumber; i++) {
    // await new Promise<void>((res) => setTimeout(() => {res()}, i * 1000))
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
      grd.addColorStop(0, '#fcc');
      grd.addColorStop(0.5, '#dcc');
      grd.addColorStop(1, '#fac');
      context.strokeStyle = grd;
      context.arc(position.x1, position.y1, 1, 2, (2 * Math.PI));
      context.stroke();
      return;
    }

    cellPositionsArray.push(position);

    context.beginPath();    
    context.arc(position.x1, position.y1, strokeRadius, 0, (2 * Math.PI));
    context.stroke();
  }
};

function App() {
  const strokeRadius = useBoomerang()
  const mainColor = useRGBABoomerang({r:100,g:100,b:100,a: 100})
  const secondaryColor = useRGBABoomerang({r:200,g:100,b:50,a: 100})
  const ternaryColor = useRGBABoomerang({r:250,g:50,b:100,a: 100})
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
      cellSpawner({mainColor, secondaryColor, ternaryColor, cellsNumber: 128000, context: context as CanvasRenderingContext2D, cellPositionsArray, strokeRadius, randomColors: gradientColors, dimensions: [windowDimensions.width, windowDimensions.height]})
  }, [gradientColors,windowDimensions])

  useEffect(() => {
    cb()
  }, [cb]);

  useEffect(() => {
    setInterval(() => setGradientColors(getRandomColors()), 0.0001)
    
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
      <canvas width={windowDimensions.width} height={windowDimensions.height} id={"game"} className={"game"} />
    </>
  );
}

export default App;
