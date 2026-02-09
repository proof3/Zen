import fetch from 'node-fetch';
import sharp from 'sharp';

async function getImageDataFromUrl(imageUrl) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${imageUrl}: ${response.statusText}`);
  }

  return await response.arrayBuffer(); // Get the image data as ArrayBuffer
}

async function compressImageBuffer(imageBuffer) {
  try {
    const image = sharp(imageBuffer);
    const compressedBuffer = await image
      .metadata()
      .then(async function(metadata) {
        //console.log(metadata);
        return await image
          .resize({ height: 1024 })// Optional: Resize image to a maximum width of 1024 pixels
          .jpeg({ mozjpeg: true, quality: 100 }) // Convert to jpeg format with 85% quality
          .toBuffer(); // Output the result as a new Buffer
      });

    //console.log(await sharp(compressedBuffer).metadata());

    console.log('Image compressed successfully!');
    return compressedBuffer;

  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
}

export { getImageDataFromUrl, compressImageBuffer };
