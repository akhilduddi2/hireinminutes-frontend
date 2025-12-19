import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    emit: (event: string, data?: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback?: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    emit: () => { },
    on: () => { },
    off: () => { },
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { profile } = useAuth();

    useEffect(() => {
        if (!profile) {
            // Disconnect socket if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) return;

        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
            auth: {
                token
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling']
        });

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            setIsConnected(false);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [profile]);

    const emit = useCallback((event: string, data?: any) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    }, [socket, isConnected]);

    const on = useCallback((event: string, callback: (data: any) => void) => {
        if (socket) {
            socket.on(event, callback);
        }
    }, [socket]);

    const off = useCallback((event: string, callback?: (data: any) => void) => {
        if (socket) {
            if (callback) {
                socket.off(event, callback);
            } else {
                socket.off(event);
            }
        }
    }, [socket]);

    const value: SocketContextType = {
        socket,
        isConnected,
        emit,
        on,
        off
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
