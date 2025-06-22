export const uploadToCloudinary = async (file: File, folder: string): Promise<{ url: string; file_type: string; originalName: string }> => {
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
  return {
    url: data.secure_url,
    file_type: file.type.split('/')[1] || 'unknown', // Use file's MIME type extension
    originalName: file.name,
  };
};