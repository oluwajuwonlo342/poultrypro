import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import api from '../../api/axios';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  const removeNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading farm notifications...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Smart Farm Alerts & Notifications</h1>
          <p className="text-sm text-gray-500">Automated vaccination reminders, feed stock alerts, and mortality warnings.</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-dark">
          {notifications.filter((n) => !n.isRead).length} Unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Bell className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-semibold text-gray-700">You&apos;re all caught up!</p>
          <p className="mt-1 text-xs text-gray-500">New vaccination, feed stock, and flock alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center ${
                item.isRead ? 'border-gray-100 bg-white' : 'border-brand-primary/40 bg-brand-light/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-brand-dark px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    {item.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.message}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {item.actionLink && (
                  <Link
                    to={item.actionLink}
                    className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
                {!item.isRead && (
                  <button
                    onClick={() => markRead(item._id)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-brand-primary hover:bg-brand-light"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => removeNotification(item._id)}
                  className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}