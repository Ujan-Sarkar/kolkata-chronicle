export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Place {
  id: string;
  name: string;
  type: 'cafe' | 'restaurant';
  location: string;
  dateVisited: string;
  ratings: {
    vibe: number;
    ambience: number;
    food: number;
    service: number;
  };
  tags: string[];
  notes: string;
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  placeId?: string;
  imageUrl?: string;
}

export interface Friend {
  id: string;
  name: string;
  monogram: string;
  color: string;
}

export interface Tale {
  id: string;
  friendId: string;
  title: string;
  date: string;
  story: string;
  placeId?: string;
  imageUrl?: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  placeId?: string;
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'quote' | 'color';
  value: string;
  caption?: string;
}

export interface TasteProfile {
  persona: string;
  description: string;
  vibe: string;
  answers: Record<string, string>;
}

export type Mode = 'solo' | 'friends' | 'family' | 'date' | 'special';
