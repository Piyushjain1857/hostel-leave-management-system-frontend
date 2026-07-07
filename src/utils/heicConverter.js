import heic2any from 'heic2any';

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
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    });
    
    const convertedFile = Array.isArray(blob) ? blob[0] : blob;
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    
    return new File([convertedFile], newName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting HEIC image:', error);
    return file; // fallback to original file if conversion fails
  }
};
