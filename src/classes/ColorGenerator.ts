export const generateRandomColor = (): string => {
    const randomColor = () => Math.floor(Math.random() * 256);
    const rgbaColor = `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 1)`;
    return rgbaColor;
  }

  export const getRandomColors = (): { color1: string; color2: string; color3: string; } => {
    const color1 = generateRandomColor();
    const color2 = generateRandomColor();
    const color3 = generateRandomColor();
    
    return {color1,color2,color3}
  }