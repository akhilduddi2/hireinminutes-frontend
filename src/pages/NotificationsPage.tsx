import { useEffect, useState, useCallback } from 'react';
import { Bell, ArrowLeft, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const loadNotifications = useCallback(async () => {
    if (!profile) return;

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/auth/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mappedNotifications = (data.data || []).map((n: unknown) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          read: n.read,
          created_at: n.createdAt
        }));
        setNotifications(mappedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
    setLoading(false);
  }, [profile]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_BASE_URL}/api/auth/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to local update
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_BASE_URL}/api/auth/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback to local update
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_BASE_URL}/api/auth/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to local update
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate(profile?.role === 'employer' ? 'recruiter-dashboard' : 'job-seeker-dashboard')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              Mark all as read
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-600">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <Card className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${!notification.read ? 'bg-slate-100 border-slate-300' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-slate-900 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(notification.created_at).toLocaleDateString()} at{' '}
                      {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="ml-4 flex-shrink-0 space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-slate-200 transition-colors"
                      >
                        <Bell className="h-5 w-5 text-slate-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}