import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance with correct cloud name
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'referral'
  },
  url: {
    secure: true
  }
});

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'referral',
  uploadPreset: 'ml_default' // Using the correct preset name
};
