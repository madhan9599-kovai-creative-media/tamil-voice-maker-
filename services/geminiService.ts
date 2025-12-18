
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";
import { decode, decodeAudioData, audioBufferToWav } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY || '';

export const generateTamilAudio = async (
  text: string,
  style: string,
  voice: VoiceName
): Promise<{ audioUrl: string; id: string }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Construct a prompt that guides the model's emotional performance and language.
  // We specify the language and the desired voice style.
  const prompt = `Speak the following Tamil text in a ${style} voice style. 
  Tamil Text: ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data was returned from the API.");
    }

    // Decode the raw PCM data
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const bytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
    
    // Convert to WAV Blob for standard browser support and URL creation
    const wavBlob = audioBufferToWav(audioBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);
    
    return {
      audioUrl,
      id: crypto.randomUUID(),
    };
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
};
