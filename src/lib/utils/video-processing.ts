export function applySharpening(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data); // make a copy

  // A basic sharpening kernel
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const side = 3;
  const half = Math.floor(side / 2);

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      for (let c = 0; c < 3; c++) {
        let i = (y * width + x) * 4 + c;
        let sum = 0;
        for (let ky = 0; ky < side; ky++) {
          for (let kx = 0; kx < side; kx++) {
            const xi = x + kx - half;
            const yi = y + ky - half;
            const idx = (yi * width + xi) * 4 + c;
            sum += copy[idx] * kernel[ky * side + kx];
          }
        }
        data[i] = Math.min(Math.max(sum, 0), 255); // clamp value
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
