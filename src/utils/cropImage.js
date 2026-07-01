// Helper to convert base64 or object URL to an Image object
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Returns a base64 encoded string of the cropped image.
 *
 * @param {string} imageSrc - The image source (data URL or object URL).
 * @param {object} pixelCrop - The cropped area in pixels { x, y, width, height }.
 * @param {number} rotation - The rotation angle in degrees.
 * @param {object} flip - Flip state { horizontal, vertical }.
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = getBoundingBox(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Extract the cropped image data
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // Return base64 string
  return canvas.toDataURL('image/jpeg');
}

function getBoundingBox(width, height, rotation) {
  const rad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height:
      Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}
