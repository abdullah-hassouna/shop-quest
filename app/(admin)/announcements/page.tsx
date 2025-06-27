"use client"

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { AnnouncementData } from '@/types/socket';

type AdminSocket = any;

const AdminAnnouncements: React.FC = () => {
    const [socket, setSocket] = useState<AdminSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [formData, setFormData] = useState({
        message: '',
        roomId: 'general',
        type: 'info' as AnnouncementData['type'],
        adminName: 'Admin'
    });

    // Available rooms - replace with your actual rooms logic
    const availableRooms = [
        { id: 'general', name: 'General' },
        { id: 'vip-customers', name: 'VIP Customers' },
        { id: 'new-arrivals', name: 'New Arrivals' },
        { id: 'sales', name: 'Sales & Promotions' },
        { id: 'support', name: 'Customer Support' }
    ];

    useEffect(() => {
        const initSocket = async () => {
            await fetch('/api/socket');

            const socketInstance = io({
                path: '/api/socket',
            });

            socketInstance.on('connect', () => {
                console.log('Admin connected to server');
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('Admin disconnected from server');
                setIsConnected(false);
            });

            setSocket(socketInstance);
        };

        initSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!socket || !formData.message.trim()) return;

        const announcement: AnnouncementData = {
            id: Date.now().toString(),
            message: formData.message.trim(),
            roomId: formData.roomId,
            timestamp: new Date(),
            adminName: formData.adminName,
            type: formData.type
        };

        socket.emit('send_announcement', announcement);

        // Clear form
        setFormData({
            ...formData,
            message: ''
        });

        alert(`Announcement sent to room: ${formData.roomId}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Announcements</h1>
                        <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-600">
                                    {isConnected ? 'Connected to server' : 'Disconnected from server'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Admin Name */}
                            <div>
                                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                                    Admin Name
                                </label>
                                <input
                                    type="text"
                                    id="adminName"
                                    name="adminName"
                                    value={formData.adminName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter admin name"
                                />
                            </div>

                            {/* Room Selection */}
                            <div>
                                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                                    Target Room
                                </label>
                                <select
                                    id="roomId"
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {availableRooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Announcement Type */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Announcement Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="info">Info</option>
                                    <option value="success">Success</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Announcement Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your announcement message..."
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={!isConnected || !formData.message.trim()}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Send Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Room Information */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Available Rooms</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableRooms.map((room) => (
                                <div key={room.id} className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                                    <p className="text-sm text-gray-500">Room ID: {room.id}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncements;