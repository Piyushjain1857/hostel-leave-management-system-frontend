import { heicTo } from 'heic-to';

/**
 * Converts a HEIC/HEIF file to standard JPEG in the frontend.
 * If the file is not a HEIC/HEIF, it returns the original file unmodified.
 * 
 * @param {File} file - The file object from file input
 * @returns {Promise<File>} - Converted File object or original file if not HEIC/HEIF
 */
export const convertHeicToJpeg = async (file) => {
  if (!file) return file;
  
  const isHEIC = file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif') || 
                 file.type === 'image/heic' || 
                 file.type === 'image/heif';
                 
  if (!isHEIC) return file;

  try {
    const convertedBlob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.8
    });
    
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    
    return new File([convertedBlob], newName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting HEIC image with heic-to:', error);
    return file; // fallback to original file if conversion fails
  }
};
