import { useEffect, useState } from 'react';
import {
  Bell, Briefcase, CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar, ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, NotificationItem } from './types';
import { Button } from '../../components/ui/Button';

export function JobSeekerNotifications(_props: JobSeekerPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const fetchNotifications = async (pageNum = 1, reset = false) => {
    try {
      setNotificationsLoading(true);
      const response = await fetch(getApiUrl(`/api/auth/notifications?page=${pageNum}&limit=20`), {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        // Map _id to id to match interface
        const mappedNotifications = (data.data || []).map((n: any) => ({
          ...n,
          id: n._id,
          created_at: n.createdAt
        }));

        if (reset) {
          setNotifications(mappedNotifications);
        } else {
          setNotifications(prev => [...prev, ...mappedNotifications]);
        }

        setHasMore(data.pagination?.page < data.pagination?.pages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, false);
  };

  const toggleNotificationDetails = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/auth/notifications/${notificationId}/read`), {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(getApiUrl('/api/auth/notifications/mark-all-read'), {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string | undefined, title: string) => {
    if (type === 'application_accepted' || title.includes('Approved')) return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    if (type === 'application_rejected' || title.includes('Rejected')) return <XCircle className="w-5 h-5 text-red-600" />;
    if (type === 'meeting_scheduled') return <Calendar className="w-5 h-5 text-purple-600" />;
    if (type === 'verification_approved') return <CheckCircle className="w-5 h-5 text-blue-600" />;
    if (title.includes('Application')) return <Briefcase className="w-5 h-5 text-slate-600" />;
    return <Bell className="w-5 h-5 text-slate-500" />;
  };

  const renderNotificationList = (list: NotificationItem[], title: string) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-2">{title}</h2>
        {list.map((notification) => {
          const isExpanded = expandedNotifications.has(notification.id);
          const icon = getNotificationIcon(notification.type, notification.title);
          const bgColor = notification.read ? 'bg-white' : 'bg-gradient-to-br from-blue-50/50 to-white';

          return (
            <div
              key={notification.id}
              className={`
                rounded-[24px] border transition-all duration-200 shadow-lg shadow-slate-200/50
                ${notification.read ? 'border-slate-100' : 'border-blue-100 shadow-blue-200/20'}
                ${bgColor}
              `}
            >
              <div
                className="p-6 flex items-start gap-4 cursor-pointer"
                onClick={() => toggleNotificationDetails(notification.id)}
              >
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm
                    ${notification.read ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200'}
                `}>
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-base font-bold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className={`text-sm mt-2 line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-600'} font-medium`}>
                    {notification.message}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shadow-lg shadow-blue-500/50" title="Unread" />
                  )}
                  <button className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-0 ml-16">
                  {notification.data && (
                    <div className="mt-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-3 shadow-sm">
                      {notification.data.jobTitle && (
                        <div>
                          <span className="font-bold text-slate-700">Role:</span> {notification.data.jobTitle}
                        </div>
                      )}
                      {notification.data.companyName && (
                        <div>
                          <span className="font-bold text-slate-700">Company:</span> {notification.data.companyName}
                        </div>
                      )}
                      {notification.data.customMessage && (
                        <div className="italic text-slate-500 border-l-2 border-slate-300 pl-3">
                          "{notification.data.customMessage}"
                        </div>
                      )}
                      {(notification.data.meetingLink || notification.data.link) && (
                        <a
                          href={notification.data.meetingLink || notification.data.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline font-bold"
                        >
                          Join Meeting <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                      {notification.data.meetingDetails && (
                        <div className="space-y-1">
                          <div className="font-bold text-slate-700">Meeting Details:</div>
                          <div>Date: {new Date(notification.data.meetingDetails.date).toDateString()}</div>
                          <div>Time: {notification.data.meetingDetails.time}</div>
                          <div>Location: {notification.data.meetingDetails.location}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {!notification.read && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkNotificationAsRead(notification.id);
                        }}
                        className="bg-white hover:bg-slate-50 border-slate-200 font-bold rounded-xl px-5"
                      >
                        Mark as read
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Notifications
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Updates on your applications and schedule
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 font-bold px-6 py-3 rounded-xl backdrop-blur-md transition-all"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {notificationsLoading && notifications.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card className="text-center py-20 border border-slate-100 bg-white rounded-[24px] shadow-lg shadow-slate-200/50">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Bell className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up</h3>
            <p className="text-slate-500 font-medium">You have no new notifications.</p>
          </Card>
        ) : (
          <>
            {renderNotificationList(unreadNotifications, 'New')}
            {renderNotificationList(readNotifications, 'Earlier')}

            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  disabled={notificationsLoading}
                  className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  {notificationsLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default JobSeekerNotifications;
