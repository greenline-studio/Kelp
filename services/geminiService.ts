import { GoogleGenAI, Type } from "@google/genai";
import { Flow, FlowStop, UserPreferences } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-pro-preview";

// Schema for structured JSON output
const flowSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the night out" },
    totalBudgetEstimate: { type: Type.STRING, description: "Estimated total cost range (e.g., $50-80)" },
    stops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          category: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          reviewCount: { type: Type.NUMBER },
          price: { type: Type.STRING },
          reason: { type: Type.STRING, description: "Why this stop fits the user's specific vibe/request" },
          durationMinutes: { type: Type.NUMBER, description: "Approximate time to spend here" },
        }
      }
    }
  }
};

export const generateFlow = async (prefs: UserPreferences): Promise<Flow> => {
  const prompt = `
    Act as "Kelp", an expert nightlife planner powered by Yelp data.
    Create a micro-itinerary (Flow) for a user in ${prefs.location || "their city"}.
    
    User Context:
    - Vibe/Scenario: "${prefs.vibe}"
    - Budget: ${prefs.budget}
    - Time: ${prefs.time}
    - Group Size: ${prefs.groupSize}

    Requirements:
    1. Generate 2 to 4 distinct stops that form a logical sequence (e.g., drinks -> dinner -> activity).
    2. Use REAL businesses known to exist in the location.
    3. Estimate ratings and review counts based on general knowledge of these popular spots (simulating Yelp data).
    4. The "reason" should be personalized to the user's vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flowSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some reasoning for better curation
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Enrich with IDs and images (mocking Yelp images for now)
    const stops: FlowStop[] = (data.stops || []).map((stop: any, index: number) => ({
      ...stop,
      id: `stop-${Date.now()}-${index}`,
      order: index + 1,
      imageUrl: `https://picsum.photos/400/300?random=${index}`, // Placeholder since we can't scrape Yelp images
      yelpUrl: `https://www.yelp.com/search?find_desc=${encodeURIComponent(stop.businessName)}&find_loc=${encodeURIComponent(prefs.location)}`,
    }));

    return {
      id: `flow-${Date.now()}`,
      title: data.title || "Your Custom Flow",
      totalDuration: stops.reduce((acc: number, s: any) => acc + (s.durationMinutes || 60), 0),
      totalBudgetEstimate: data.totalBudgetEstimate || "$$",
      stops
    };

  } catch (error) {
    console.error("Gemini Flow Generation Error:", error);
    throw new Error("Failed to generate flow. Please try again.");
  }
};

export const chatWithFlow = async (
  currentFlow: Flow, 
  history: { role: string; content: string }[], 
  newMessage: string
): Promise<{ text: string; updatedFlow?: Flow; suggestedActions?: string[] }> => {
  
  // We want to determine if the user is asking to modify the flow or just chatting.
  const prompt = `
    You are Kelp, a nightlife assistant.
    Current Flow Context: ${JSON.stringify(currentFlow)}
    User Request: "${newMessage}"
    
    If the user request implies changing the itinerary (e.g., "swap the second stop", "make it cheaper", "find a place with patio"), 
    you must output JSON with an "updatedFlow" property matching the flow schema, and a "text" property explaining the change.
    
    If it's just a general question (e.g., "what is the dress code?"), just return JSON with "text" and null for "updatedFlow".

    ALWAYS provide "suggestedActions": A list of 3-4 short, specific follow-up options for the user based on the new state (e.g. "Find a dessert spot", "Make it walkable", "Swap dinner for tacos").
  `;

  // Complex schema for chat response
  const chatSchema = {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING },
      suggestedActions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3-4 short follow-up actions for the user."
      },
      updatedFlow: {
        type: Type.OBJECT,
        nullable: true,
        properties: flowSchema.properties
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: chatSchema
        }
    });

    const result = JSON.parse(response.text || "{}");
    
    let processedFlow: Flow | undefined = undefined;

    if (result.updatedFlow && result.updatedFlow.stops) {
         const stops: FlowStop[] = (result.updatedFlow.stops || []).map((stop: any, index: number) => ({
            ...stop,
            id: `stop-${Date.now()}-${index}`,
            order: index + 1,
            imageUrl: `https://picsum.photos/400/300?random=${index + 10}`,
            yelpUrl: `https://www.yelp.com/search?find_desc=${encodeURIComponent(stop.businessName)}`,
          }));
          
          processedFlow = {
            id: `flow-${Date.now()}`,
            title: result.updatedFlow.title || currentFlow.title,
            totalDuration: stops.reduce((acc: number, s: any) => acc + (s.durationMinutes || 60), 0),
            totalBudgetEstimate: result.updatedFlow.totalBudgetEstimate || currentFlow.totalBudgetEstimate,
            stops
          };
    }

    return {
        text: result.text,
        updatedFlow: processedFlow,
        suggestedActions: result.suggestedActions
    };

  } catch (e) {
      console.error(e);
      return { text: "I'm having trouble connecting to the Yelp knowledge base right now. Could you try rephrasing?" };
  }
};