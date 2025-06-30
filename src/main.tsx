import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Authenticator, View, Heading, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { awsConfig } from "./config";

// Merge Amplify outputs with custom S3 and API Gateway configuration
Amplify.configure({
  ...outputs,
  Storage: {
    S3: {
      bucket: awsConfig.storage.bucket,
      region: awsConfig.storage.region
    }
  },
  API: {
    REST: {
      [awsConfig.api.name]: {
        endpoint: awsConfig.api.endpoint,
        region: awsConfig.api.region
      }
    }
  }
});

const theme = createTheme({
  name: 'sustainability-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#e6f0e6',
          20: '#cce0cc',
          40: '#99c199',
          60: '#66a366',
          80: '#338433',
          90: '#196419',
          100: '#004400',
        }
      }
    }
  }
});

const components = {
  Header() {
    return (
      <View textAlign="center" padding="large">
        <Heading 
          level={1} 
          color="white"
          fontFamily="Bookman, URW Bookman L, serif"
          fontSize="3rem"
          fontWeight="300"
          letterSpacing="0.05em"
        >
          Sustainability Recommendation Engine
        </Heading>
      </View>
    );
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Authenticator components={components}>
        <App />
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);
