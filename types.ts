export interface FlowStop {
  id: string;
  order: number;
  businessName: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: string;
  imageUrl: string;
  yelpUrl: string;
  reason: string;
  durationMinutes: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Flow {
  id: string;
  title: string;
  totalDuration: number; // minutes
  totalBudgetEstimate: string;
  stops: FlowStop[];
}

export interface UserPreferences {
  location: string;
  vibe: string;
  budget: '$' | '$$' | '$$$' | '$$$$';
  time: 'afternoon' | 'evening' | 'late_night';
  groupSize: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isTyping?: boolean;
  timestamp: number;
  relatedFlowId?: string; // If this message generated a flow update
  suggestedActions?: string[]; // AI-generated dynamic suggestions
}

export enum ViewState {
  LANDING = 'LANDING',
  APP = 'APP',
  FLOW_VIEW = 'FLOW_VIEW'
}