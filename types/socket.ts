export interface ServerToClientEvents {
    announcement: (data: AnnouncementData) => void;
    user_joined_room: (data: { userId: string; roomId: string }) => void;
}

export interface ClientToServerEvents {
    join_room: (roomId: string) => void;
    leave_room: (roomId: string) => void;
    send_announcement: (data: AnnouncementData) => void;
    send_notification: (data: AnnouncementData) => void;
}

export interface AnnouncementData {
    id: string;
    message: string;
    roomId: string;
    timestamp: Date;
    type: 'info' | 'warning' | 'success' | 'error';
}


export interface NotificationData {
    id: string;
    message: string;
    roomId: string;
    timestamp: Date;
    type: 'info' | 'warning' | 'success' | 'error';
}