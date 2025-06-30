import { create } from 'zustand';
import { AnnouncementData } from '../types/socket';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AnnouncementStore {
    announcements: AnnouncementData[];
    unreadCount: number;
    connectedRooms: string[];
    isConnected: boolean;

    // Actions
    addAnnouncement: (announcements: AnnouncementData | AnnouncementData[]) => void;
    getLastAnnouncement: () => AnnouncementData[];
    markAsRead: (announcementId: string) => void;
    markAllAsRead: () => void;
    clearAnnouncements: () => void;
    setConnectedRooms: (rooms: string[]) => void;
    setConnectionStatus: (status: boolean) => void;
}

export const useAnnouncementStore = create<AnnouncementStore>()(
    persist((set, get) => ({
        announcements: [],
        unreadCount: 0,
        connectedRooms: [],
        isConnected: false,
        getLastAnnouncement: () => {
            const { announcements } = get();
            return announcements.slice(0, 5);
        },
        addAnnouncement: (announcements) => {
            if (typeof announcements === 'object' && !Array.isArray(announcements)) {
                set((state) => ({
                    announcements: [announcements, ...state.announcements].slice(0, 50), // Keep only last 50
                    unreadCount: state.unreadCount + 1
                }));
            } else if (Array.isArray(announcements)) {
                set(() => ({
                    announcements: announcements
                }));
            }
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
    }), {
        name: 'announcements-storage', // Unique name for the storage
        storage: createJSONStorage(() => localStorage),
    }));