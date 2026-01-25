import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file: File, folder: string = 'nijsci') => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Auto-detect image or video
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteMedia = async (url: string) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return;

    // Determine resource type based on URL or assume 'image' but try both if unsure?
    // Cloudinary URLs: /image/upload/ or /video/upload/
    const resourceType = url.includes('/video/upload/') ? 'video' : 'image';

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

export const getPublicIdFromUrl = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return '';
    
    // slice from uploadIndex + 1
    // usually: [ 'v123456789', 'folder', 'filename.ext' ]
    const pathParts = parts.slice(uploadIndex + 1);
    
    // Filter out version (e.g., v1234567890)
    // Version starts with 'v' followed by numbers
    const validParts = pathParts.filter(p => !p.match(/^v\d+$/));
    
    // Join back to get "folder/filename.ext"
    const publicIdWithExt = validParts.join('/');
    
    // Remove extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    
    return publicId;
  } catch (e) {
    console.error('Error extracting public ID:', e);
    return '';
  }
};
