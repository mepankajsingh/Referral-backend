import { useRef, useState } from 'react';
import { cloudinaryConfig } from '@/lib/cloudinary';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
  className?: string;
}

const CloudinaryUploadWidget = ({
  onUploadSuccess,
  buttonText = 'Upload Image',
  className = ''
}: CloudinaryUploadWidgetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent any default behavior
    
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected:', file.name, file.type, file.size);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting upload to Cloudinary...');
      console.log('Using cloud name:', cloudinaryConfig.cloudName);
      console.log('Using upload preset:', cloudinaryConfig.uploadPreset);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      
      // Upload directly to Cloudinary using their REST API
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
      console.log('Uploading to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Upload successful, received data:', data);
      
      if (data.secure_url) {
        console.log('Secure URL:', data.secure_url);
        onUploadSuccess(data.secure_url);
      } else {
        throw new Error('No secure_url in response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event propagation
    
    console.log('Upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button
        type="button" // Explicitly set type to button to prevent form submission
        onClick={handleClick}
        disabled={isLoading}
        className={`px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center ${className} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            {buttonText}
          </>
        )}
      </button>
      
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;
