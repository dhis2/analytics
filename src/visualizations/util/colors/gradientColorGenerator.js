const hex = (c) => {
    const s = "0123456789abcdef";
    let i = parseInt(c, 10);
    if (i === 0 || isNaN(c)) {
      return "00";
    }
    i = Math.round(Math.min(Math.max(0, i), 255));
    return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
  };
  
  /* Convert an RGB triplet to a hex string */
  const convertToHex = (rgb) => hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  
  /* Remove '#' in color hex string */
  const trim = (s) => (s.charAt(0) === "#" ? s.substring(1, 7) : s);
  
  /* Convert a hex string to an RGB triplet */
  const convertToRGB = (hex) => {
    const color = [];
    color[0] = parseInt(trim(hex).substring(0, 2), 16);
    color[1] = parseInt(trim(hex).substring(2, 4), 16);
    color[2] = parseInt(trim(hex).substring(4, 6), 16);
    return color;
  };
  
  export const generateColors = (colorStart, colorEnd, colorCount, addHash) => {
    const start = convertToRGB(colorStart), // The beginning of gradient
        end = convertToRGB(colorEnd), // The end of gradient
        result = [];
    let alpha = 0.0; //Alpha blending amount
  
    for (let i = 0; i < colorCount; i++) {
      const colors = [];
      alpha += 1.0 / colorCount;
  
      colors[0] = start[0] * alpha + (1 - alpha) * end[0];
      colors[1] = start[1] * alpha + (1 - alpha) * end[1];
      colors[2] = start[2] * alpha + (1 - alpha) * end[2];
  
      result.push((addHash ? "#" : "") + convertToHex(colors));
    }
  
    return result;
  };