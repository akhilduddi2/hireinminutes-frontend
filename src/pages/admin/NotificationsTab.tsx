import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, Mail, Eye, Trash2, MessageSquare,
  CheckCircle, Archive, Clock
} from 'lucide-react';
import type { ContactSubmission } from './types';

interface NotificationsTabProps {
  contacts: ContactSubmission[];
  contactsLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewContact: (contact: ContactSubmission) => void;
  onDeleteContact: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  contacts,
  contactsLoading,
  searchQuery,
  onSearchChange,
  onViewContact,
  onDeleteContact,
  onMarkAsRead
}) => {
  const filteredContacts = contacts.filter(contact =>
    searchQuery === '' ||
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => !c.isRead).length,
    today: contacts.filter(c => {
      const date = new Date(c.createdAt);
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    }).length
  };

  if (contactsLoading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Support Inbox</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Manage inquiries, feedback, and support requests from users.
            </p>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="h-5 w-5 text-pink-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Unread Messages</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.unread}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Received Today</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Archive className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total History</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject, name or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{filteredContacts.length}</span> messages found
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <MessageSquare className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Inbox Empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto">All caught up! New support submissions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className={`group p-4 sm:p-5 hover:bg-slate-50 transition-all cursor-pointer border-l-4 ${!contact.isRead ? 'bg-pink-50/30 border-l-pink-500' : 'bg-white border-l-transparent'
                  }`}
                onClick={() => onViewContact(contact)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar / Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${!contact.isRead ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-base truncate pr-4 ${!contact.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {contact.subject}
                      </h3>
                      <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-slate-600 font-medium">From: {contact.name}</span>
                        <span className="text-xs text-slate-400 text-ellipsis overflow-hidden">{contact.message?.substring(0, 100)}...</span>
                      </div>

                      {/* Actions (visible on hover) */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!contact.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                            onClick={(e) => { e.stopPropagation(); onMarkAsRead(contact._id); }}
                            title="Mark as Read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                          onClick={(e) => { e.stopPropagation(); onViewContact(contact); }}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500"
                          onClick={(e) => { e.stopPropagation(); onDeleteContact(contact._id); }}
                          title="Delete Message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

// Contact View Modal
interface ContactViewModalProps {
  isOpen: boolean;
  contact: ContactSubmission | null;
  onClose: () => void;
}

export const ContactViewModal: React.FC<ContactViewModalProps> = ({ isOpen, contact, onClose }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all scale-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{contact.name}</h2>
              <p className="text-xs text-slate-500">{contact.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 rounded-full h-8 w-8 p-0">
            <span className="text-xl leading-none">&times;</span>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
              <h3 className="text-lg font-semibold text-slate-900">{contact.subject}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {new Date(contact.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</label>
            <div className="bg-slate-50 p-5 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap text-sm border border-slate-100">
              {contact.message}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-slate-200 hover:bg-white text-slate-600">Close</Button>
          <Button className="ml-2 bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20">
            <Mail className="h-4 w-4 mr-2" />
            Reply via Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
