import { useEffect, useState } from "react";
import "./App.css";
import { getRandomColors } from "./classes/ColorGenerator";

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

const range = 0.1;

const cellSpawner = async (
  cellsNumber: number,
  context: CanvasRenderingContext2D,
  cellPositionsArray: IPosition[],
  randomColors?: { color1: string; color2: string; color3: string; }
) => {
  for (let i = 0; i < cellsNumber; i++) {
    // await new Promise<void>((res) => setTimeout(() => {res()}, i * 1000))

    const mainColor = "#fff";
    const secondaryColor = "#000";
    const ternaryColor = "#f0f";
    context.strokeStyle = mainColor;

    const randomX = Math.ceil(Math.random() * 300);
    const randomY = Math.ceil(Math.random() * 150);
    const lineFinishX = randomX % 2 === 0 ? randomX - 4 : randomX + 4;
    const lineFinishY = randomY + 4;

    if (randomX % 2 === 0) {
      context.strokeStyle = secondaryColor;
    }

    if (randomX % 3 === 0) {
      context.strokeStyle = ternaryColor;
    }

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
      context.arc(position.x1, position.y1, 0.1, 0, 2 * Math.PI);
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

  useEffect(() => {
      const cellPositionsArray: IPosition[] = [];
      const gameCanvas: HTMLCanvasElement = document.getElementById(
        "game"
      ) as HTMLCanvasElement;
      const context = gameCanvas?.getContext("2d");
      const x = setInterval(
        () => cellSpawner(48, context as CanvasRenderingContext2D, cellPositionsArray, gradientColors),
        0.1
      );
  }, [gradientColors]);

  useEffect(() => {
    setInterval(() => setGradientColors(getRandomColors()), 15000)
  }, [])

  return (
    <>
      <canvas id={"game"} className={"game"} />
    </>
  );
}

export default App;
