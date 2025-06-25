export const mimeToFileTypeMap: { [key: string]: 'pdf' | 'docx' | 'img' | 'ppt' | 'video' } = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'image/jpeg': 'img',
  'image/png': 'img',
  'image/gif': 'img',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
  'video/mp4': 'video',
  'video/avi': 'video',
  'video/mov': 'video',
  'video/quicktime': 'video', // For .mov files
};

export const uploadToCloudinary = async (file: File, folder: string): Promise<{ url: string; file_type: 'pdf' | 'docx' | 'img' | 'ppt' | 'video'; originalName: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'fet_space_sms'); // Replace with your actual preset
  formData.append('folder', `${folder}/${new Date().toISOString().split('T')[0]}`);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  formData.append('public_id', sanitizedName.replace(/\.[^/.]+$/, ''));

  const response = await fetch(`https://api.cloudinary.com/v1_1/dkz9lhvhb/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error.message} (Status: ${response.status})`);
  }

  const data = await response.json();
  const fileType = mimeToFileTypeMap[file.type] || 'img'; // Default to 'img' if MIME type not recognized
  return {
    url: data.secure_url,
    file_type: fileType,
    originalName: file.name,
  };
};