import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Place, Memory, Friend, Tale, Goal, MoodboardItem, TasteProfile, Mode } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Places (Passport)
  places: Place[];
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (id: string, place: Partial<Place>) => void;
  deletePlace: (id: string) => void;

  // Memories (Scrapbook)
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id'>) => void;
  updateMemory: (id: string, memory: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;

  // Friends & Tales
  friends: Friend[];
  tales: Tale[];
  addFriend: (friend: Omit<Friend, 'id'>) => void;
  deleteFriend: (id: string) => void;
  addTale: (tale: Omit<Tale, 'id'>) => void;
  updateTale: (id: string, tale: Partial<Tale>) => void;
  deleteTale: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Moodboard
  moodboardItems: MoodboardItem[];
  addMoodboardItem: (item: Omit<MoodboardItem, 'id'>) => void;
  deleteMoodboardItem: (id: string) => void;

  // Taste Profile
  tasteProfile: TasteProfile | null;
  setTasteProfile: (profile: TasteProfile) => void;

  // Current Mode
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial mock data
const initialPlaces: Place[] = [
  {
    id: '1',
    name: 'Flurys',
    type: 'cafe',
    location: 'Park Street, Kolkata',
    dateVisited: '2024-12-01',
    ratings: { vibe: 5, ambience: 5, food: 4, service: 4 },
    tags: ['heritage', 'breakfast', 'iconic'],
    notes: 'The original Kolkata tea room experience. Timeless.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
  },
  {
    id: '2',
    name: 'Peter Cat',
    type: 'restaurant',
    location: 'Park Street, Kolkata',
    dateVisited: '2024-11-15',
    ratings: { vibe: 4, ambience: 4, food: 5, service: 4 },
    tags: ['chelo kebab', 'legendary', 'dinner'],
    notes: 'The Chelo Kebab is unmatched. Always a queue, always worth it.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  },
  {
    id: '3',
    name: 'Mrs. Magpie',
    type: 'cafe',
    location: 'Hindustan Park, Kolkata',
    dateVisited: '2024-10-20',
    ratings: { vibe: 5, ambience: 5, food: 5, service: 5 },
    tags: ['desserts', 'aesthetic', 'cozy'],
    notes: 'Best cheesecake in the city. Period.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  },
];

const initialFriends: Friend[] = [
  { id: '1', name: 'Priya', monogram: 'P', color: '#D7B47A' },
  { id: '2', name: 'Ria', monogram: 'R', color: '#7B3230' },
  { id: '3', name: 'Ananya', monogram: 'A', color: '#2F4F4F' },
];

const initialTales: Tale[] = [
  {
    id: '1',
    friendId: '1',
    title: 'The Rainy Evening at Flurys',
    date: '2024-08-15',
    story: 'We sat by the window watching the monsoon pour down Park Street. The hot chocolate was perfect, and we talked for hours about everything and nothing.',
    placeId: '1',
  },
  {
    id: '2',
    friendId: '2',
    title: 'Birthday Dinner Surprise',
    date: '2024-07-20',
    story: 'Ria planned the most elaborate surprise at Peter Cat. The Chelo Kebab never tasted better than when shared with friends.',
    placeId: '2',
  },
];

const initialGoals: Goal[] = [
  { id: '1', text: 'Try 10 new cafés this year', completed: false },
  { id: '2', text: 'Host a dinner party', completed: true },
  { id: '3', text: 'Visit Victoria Memorial at sunset', completed: false },
  { id: '4', text: 'Take a yellow taxi ride through North Kolkata', completed: true },
  { id: '5', text: 'Write 12 tales with friends', completed: false },
];

const initialMoodboardItems: MoodboardItem[] = [
  { id: '1', type: 'quote', value: '"Kolkata is a feeling, not just a city."' },
  { id: '2', type: 'color', value: '#D7B47A', caption: 'Antique Gold' },
  { id: '3', type: 'image', value: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', caption: 'Heritage corridors' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        // TODO: connect to backend API
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
        set({
          user: {
            id: '1',
            name: 'Swass',
            email,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          },
          isAuthenticated: true,
        });
        return true;
      },
      logout: () => {
        // TODO: connect to backend API
        set({ user: null, isAuthenticated: false });
      },

      // Places
      places: initialPlaces,
      addPlace: (place) => {
        // TODO: connect to backend API
        set((state) => ({
          places: [...state.places, { ...place, id: generateId() }],
        }));
      },
      updatePlace: (id, updates) => {
        // TODO: connect to backend API
        set((state) => ({
          places: state.places.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deletePlace: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          places: state.places.filter((p) => p.id !== id),
        }));
      },

      // Memories
      memories: [],
      addMemory: (memory) => {
        // TODO: connect to backend API
        set((state) => ({
          memories: [...state.memories, { ...memory, id: generateId() }],
        }));
      },
      updateMemory: (id, updates) => {
        // TODO: connect to backend API
        set((state) => ({
          memories: state.memories.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
      deleteMemory: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        }));
      },

      // Friends & Tales
      friends: initialFriends,
      tales: initialTales,
      addFriend: (friend) => {
        // TODO: connect to backend API
        set((state) => ({
          friends: [...state.friends, { ...friend, id: generateId() }],
        }));
      },
      deleteFriend: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== id),
          tales: state.tales.filter((t) => t.friendId !== id),
        }));
      },
      addTale: (tale) => {
        // TODO: connect to backend API
        set((state) => ({
          tales: [...state.tales, { ...tale, id: generateId() }],
        }));
      },
      updateTale: (id, updates) => {
        // TODO: connect to backend API
        set((state) => ({
          tales: state.tales.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      deleteTale: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          tales: state.tales.filter((t) => t.id !== id),
        }));
      },

      // Goals
      goals: initialGoals,
      addGoal: (goal) => {
        // TODO: connect to backend API
        set((state) => ({
          goals: [...state.goals, { ...goal, id: generateId() }],
        }));
      },
      toggleGoal: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, completed: !g.completed } : g
          ),
        }));
      },
      deleteGoal: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      // Moodboard
      moodboardItems: initialMoodboardItems,
      addMoodboardItem: (item) => {
        // TODO: connect to backend API
        set((state) => ({
          moodboardItems: [...state.moodboardItems, { ...item, id: generateId() }],
        }));
      },
      deleteMoodboardItem: (id) => {
        // TODO: connect to backend API
        set((state) => ({
          moodboardItems: state.moodboardItems.filter((m) => m.id !== id),
        }));
      },

      // Taste Profile
      tasteProfile: null,
      setTasteProfile: (profile) => {
        // TODO: connect to backend API
        set({ tasteProfile: profile });
      },

      // Mode
      currentMode: 'solo',
      setCurrentMode: (mode) => set({ currentMode: mode }),
    }),
    {
      name: 'house-of-swass-storage',
    }
  )
);
