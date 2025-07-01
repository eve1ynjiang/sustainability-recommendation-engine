import { useState, useRef } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { awsConfig } from '../config';

interface UploadPageProps {
  onComplete: () => void;
}

// Using API Gateway as a proxy to S3 bucket

export function UploadPage({ onComplete }: UploadPageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Use the API Gateway endpoint to upload the file
      //const uploadUrl = `${awsConfig.api.endpoint}/${awsConfig.api.stage}/${awsConfig.storage.bucket}/${selectedFile.name}`;
      const uploadUrl = `https://u65botpq5e.execute-api.us-east-1.amazonaws.com/dev/upload`
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type
        }
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
      onComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Files</h2>
      <p>Please upload your data files here</p>
      
      <div className="manual-upload">
        <input 
          type="file" 
          onChange={handleFileChange} 
          ref={fileInputRef}
        />
        <button 
          onClick={handleUploadClick} 
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
