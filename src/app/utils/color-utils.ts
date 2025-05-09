/**
 * Converts a hexadecimal color value to normalized RGB components.
 * @param hex - The hexadecimal color value (e.g., 0xffffff or "#ffffff").
 * @returns An object with normalized r, g, and b values in the range [0, 1].
 */
export function hexToRgb(hex: string | number): {
  r: number;
  g: number;
  b: number;
} {
  if (typeof hex === 'string') {
    hex = parseInt(hex.replace('#', ''), 16);
  }

  return {
    r: ((hex >> 16) & 0xff) / 255, // Extract red and normalize to [0, 1]
    g: ((hex >> 8) & 0xff) / 255, // Extract green and normalize to [0, 1]
    b: (hex & 0xff) / 255, // Extract blue and normalize to [0, 1]
  };
}

export function setVertexColor(
  colors: Float32Array,
  colorpos: number,
  hex: number | string,
  alpha: number = 1.0,
): number {
  const { r, g, b } = hexToRgb(hex); // Convert hex to RGB
  colors[colorpos++] = r * alpha; // Red component
  colors[colorpos++] = g * alpha; // Green component
  colors[colorpos++] = b * alpha; // Blue component
  return colorpos;
}
