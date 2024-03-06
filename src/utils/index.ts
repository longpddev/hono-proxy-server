export function fromCodePoint(nums: Iterable<number>) {
  let result = "";
  for (const num of nums) {
      result += String.fromCodePoint(num);
  }

  return result;
}

export function groupImages(
  uris: string[],
  { width = 100, height = 100, cols = 2 } = {}
) {
  const totalRow = Math.ceil(uris.length / cols);
  const totalCols = Math.min(uris.length, cols);
  const containerWidth = width * totalCols;
  const containerHeight = height * totalRow;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${containerWidth}" height="${containerHeight}" viewBox="0 0 ${containerWidth} ${containerHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${uris
          .map((uri, i) => {
              const row = Math.floor(i / cols);
              const col = i - row * cols;
              const x = col * width;
              const y = row * height;
              return `<image x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${uri}" />`;
          })
          .join(" ")}
</svg>`;
}