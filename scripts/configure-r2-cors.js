// scripts/configure-r2-cors.js
// This script configures CORS for your Cloudflare R2 bucket
// Run with: node scripts/configure-r2-cors.js

const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function configureCors() {
  try {
    // Initialize S3 client for Cloudflare R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      },
    });

    // Configure CORS for the bucket
    const corsParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            // Allow requests from any origin
            AllowedOrigins: ['*'],
            // Allow all HTTP methods needed for uploads
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            // Allow all headers in preflight request
            AllowedHeaders: ['*'],
            // Allow browsers to expose these headers to your JavaScript code
            ExposeHeaders: ['ETag'],
            // Cache preflight request results for 1 hour (3600 seconds)
            MaxAgeSeconds: 3600,
          },
        ],
      },
    };

    // Apply the CORS configuration
    const command = new PutBucketCorsCommand(corsParams);
    const response = await s3Client.send(command);
    
    console.log('✅ CORS configuration applied successfully!');
    console.log('Your R2 bucket is now configured to accept direct uploads from your frontend.');
    
    return response;
  } catch (error) {
    console.error('❌ Error configuring CORS for R2 bucket:', error);
    throw error;
  }
}

// Run the configuration
configureCors();
