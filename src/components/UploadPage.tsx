import { useState } from 'react';

interface UploadPageProps {
  onComplete: () => void;
}

export function UploadPage({ onComplete }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // triggered when the user selects a file in the file input field
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // sets file
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    // checks if file has been selected before starting the upload
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      //const formData = new FormData();
      //formData.append('file', file);

      const binaryData = await file.arrayBuffer();

      const folder = 'sustainability-app-storage-1122';
      //const object = encodeURIComponent(file.name); 
      const object = file.name;
      //fetch('https://cors-anywhere.herokuapp.com/https://u65botpq5e.execute-api.us-east-1.amazonaws.com/dev/sustainability-app-storage-1122/10k.pdf')

      const url = `https://u65botpq5e.execute-api.us-east-1.amazonaws.com/dev/sustainability-app-storage-1122/10k.pdf`;

      const response = await fetch( url,
        {
          method: 'PUT',
          body: file,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        const errorCode = response.status;
        throw new Error(`Error ${errorCode}: ${message}`);
      }

      onComplete();
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Welcome to Sustainability Recommendation Engine</h1>
      <p>Please upload your sustainability data to get started</p>

      <div className="upload-form">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {file && (
          <div className="file-info">
            <p>Selected file: {file.name}</p>
            <button
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message" style={{ color: 'red' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
