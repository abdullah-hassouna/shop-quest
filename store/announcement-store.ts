import { create } from 'zustand';
import { AnnouncementData } from '../types/socket';

interface AnnouncementStore {
    announcements: AnnouncementData[];
    unreadCount: number;
    connectedRooms: string[];
    isConnected: boolean;

    // Actions
    addAnnouncement: (announcement: AnnouncementData) => void;
    markAsRead: (announcementId: string) => void;
    markAllAsRead: () => void;
    clearAnnouncements: () => void;
    setConnectedRooms: (rooms: string[]) => void;
    setConnectionStatus: (status: boolean) => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
    announcements: [],
    unreadCount: 0,
    connectedRooms: [],
    isConnected: false,

    addAnnouncement: (announcement) => {
        set((state) => ({
            announcements: [announcement, ...state.announcements].slice(0, 50), // Keep only last 50
            unreadCount: state.unreadCount + 1
        }));
    },

    markAsRead: (announcementId) => {
        set((state) => {
            const announcement = state.announcements.find(a => a.id === announcementId);
            if (announcement && state.unreadCount > 0) {
                return { unreadCount: state.unreadCount - 1 };
            }
            return state;
        });
    },

    markAllAsRead: () => {
        set({ unreadCount: 0 });
    },

    clearAnnouncements: () => {
        set({ announcements: [], unreadCount: 0 });
    },

    setConnectedRooms: (rooms) => {
        set({ connectedRooms: rooms });
    },

    setConnectionStatus: (status) => {
        set({ isConnected: status });
    }
}));