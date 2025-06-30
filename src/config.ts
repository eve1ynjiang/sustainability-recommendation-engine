// Replace these values with your actual AWS resource information
export const awsConfig = {
  // S3 bucket configuration
  storage: {
    bucket: 'sustainability-app-storage-1122',
    region: 'us-east-1', // Replace with your bucket's region
  },
  
  // API Gateway configuration
  api: {
    name: 'sustainable-engine-api', // Name used to reference this API in Amplify
    endpoint: 'https://u65botpq5e.execute-api.us-east-1.amazonaws.com',
    region: 'us-east-1', // Replace with your API's region
    paths: {
      processFile: '/process-file' // Path to your API endpoint that processes uploaded files
    }
  }
};