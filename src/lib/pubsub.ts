// src/lib/pubsub.ts
import { PubSub } from '@google-cloud/pubsub';

// Initialize PubSub client with credentials from environment variables
let pubSubClient: PubSub | null = null;

export function getPubSubClient(): PubSub {
  if (!pubSubClient) {
    try {
      // Check if we have the required environment variables
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
      
      if (!projectId || !credentialsBase64) {
        throw new Error('Missing Google Cloud PubSub configuration');
      }
      
      // Decode the base64 credentials
      const credentials = JSON.parse(
        Buffer.from(credentialsBase64, 'base64').toString('utf-8')
      );
      
      // Initialize the PubSub client
      pubSubClient = new PubSub({
        projectId,
        credentials,
      });
    } catch (error) {
      // Silently handle initialization error
      throw error;
    }
  }
  
  return pubSubClient;
}

/**
 * Publishes a video upload event to Google Cloud PubSub
 * @param videoId - The ID of the uploaded video
 * @returns Promise resolving to the message ID
 */
export async function publishVideoUploadEvent(videoId: string): Promise<string> {
  try {
    const pubsub = getPubSubClient();
    const topicName = process.env.GOOGLE_PUBSUB_TOPIC;
    
    if (!topicName) {
      throw new Error('Missing PubSub topic name');
    }
    
    // Create the JSON message with the video ID
    const data = JSON.stringify({ id: videoId });
    
    // Publish the message
    const messageId = await pubsub.topic(topicName).publishMessage({
      data: Buffer.from(data),
    });
    
    return messageId;
  } catch (error) {
    console.error('Error publishing video upload event:', error);
    throw error;
  }
}
