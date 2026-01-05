
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeolocationResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `Act as a world-class forensic geolocator. Analyze this image in extreme detail. 
          Identify: 
          1. Architecture style and building materials.
          2. Flora, climate indicators, and sun/shadow positions.
          3. License plates, street signs, store names, or specific brand fonts.
          4. Infrastructure like utility poles, pavement types, or traffic light designs.
          5. Geographic landmarks or unique topography.
          Provide a highly detailed technical description of the location features to help a mapping tool find the exact coordinates.`,
        },
      ],
    },
  });

  return response.text || "No description generated.";
};

export const locateSpot = async (
  description: string, 
  base64Image: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<GeolocationResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Use Gemini 2.5 Flash for the specific Google Maps grounding capabilities
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `Based on this image and the following technical description, pinpoint the exact geographical spot on Google Maps: 
          Description: ${description}
          ${userLocation ? `Hint: The user is currently near ${userLocation.latitude}, ${userLocation.longitude}.` : ''}
          Provide the name of the place, address, and explain why this is the correct location.`,
        }
      ]
    },
    config: {
      tools: [{ googleMaps: {} }],
      ...(userLocation && {
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }
          }
        }
      })
    },
  });

  const text = response.text || "Could not pinpoint location.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    text,
    chunks: chunks as any,
  };
};

export const fastCheck = async (message: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: message,
  });
  return response.text || "";
};
