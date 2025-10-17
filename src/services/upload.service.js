// src/services/upload.service.js

// NOTE: Removed Firebase Storage imports, keeping only Cloudinary logic
// We don't need updateStudent or uuidv4 here unless used elsewhere in this service.

export async function uploadItemPhoto(file) {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Ensure these environment variables are set in your .env file!
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  // Basic validation that config is present
  if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET).");
  }
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // You may want to add folder/tags here if needed, e.g., formData.append('folder', 'lost_and_found_items');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        // Attempt to get a detailed error message from Cloudinary response
        const errorText = await response.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error(`Image upload failed: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    return data.secure_url; // This is the URL we will save to Firestore
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}