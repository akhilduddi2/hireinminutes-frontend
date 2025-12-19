import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, Plus, Bell, Edit, Trash2, Filter,
  Info, AlertTriangle, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import type { Alert, AlertFormData } from './types';

interface AlertsTabProps {
  alerts: Alert[];
  alertsLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddAlert: () => void;
  onEditAlert: (alert: Alert) => void;
  onDeleteAlert: (id: string) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  alertsLoading,
  searchQuery,
  onSearchChange,
  onAddAlert,
  onEditAlert,
  onDeleteAlert
}) => {
  const filteredAlerts = alerts.filter(alert =>
    searchQuery === '' ||
    (alert.title || alert.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.isActive).length,
    warnings: alerts.filter(a => a.type === 'warning').length,
    errors: alerts.filter(a => a.type === 'error').length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default: return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'error': return 'bg-red-50 border-red-200 text-red-700';
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  if (alertsLoading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading system alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">System Alerts</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Broadcast critical information, maintenance schedules, and platform updates.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onAddAlert} className="bg-blue-500 hover:bg-blue-600 border-none shadow-lg shadow-blue-500/30 text-white font-semibold transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Alerts</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Now</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Warnings</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.warnings}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Errors</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.errors}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="flex-1 w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts by title or message..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter Type
            </Button>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No alerts found</h3>
            <p className="text-slate-500 mb-6">Create a new system alert to notify users.</p>
            <Button onClick={onAddAlert} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Notification
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAlerts.map((alert) => (
              <div key={alert._id} className="p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alert.type === 'info' ? 'bg-blue-100' :
                    alert.type === 'warning' ? 'bg-amber-100' :
                      alert.type === 'error' ? 'bg-red-100' :
                        'bg-emerald-100'
                    }`}>
                    {getTypeIcon(alert.type || 'info')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg truncate">{alert.title || alert.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeStyles(alert.type || 'info')}`}>
                        {alert.type}
                      </span>
                      {alert.isActive ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 ml-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 ml-2">Inactive</span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-3 leading-relaxed">{alert.message}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                      {alert.expiresAt && (
                        <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3" />
                          Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg"
                      onClick={() => onEditAlert(alert)}
                      title="Edit Alert"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-lg"
                      onClick={() => onDeleteAlert(alert._id)}
                      title="Delete Alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

// Alert Modal Component
interface AlertModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: AlertFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<AlertFormData>) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all scale-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Alert' : 'Create System Alert'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure notificaton details below.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 rounded-full h-8 w-8 p-0">
            <span className="text-xl leading-none">&times;</span>
          </Button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alert Title</label>
              <input
                type="text"
                value={formData.title || formData.name || ''}
                onChange={(e) => onChange({ title: e.target.value, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="e.g. Scheduled Maintenance"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message Content</label>
              <textarea
                value={formData.message}
                onChange={(e) => onChange({ message: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                rows={4}
                placeholder="Enter the detailed message for users..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alert Type</label>
                <div className="relative">
                  <select
                    value={formData.type || 'info'}
                    onChange={(e) => onChange({ type: e.target.value as 'info' | 'warning' | 'error' | 'success' })}
                    className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="error">Error (Red)</option>
                    <option value="success">Success (Green)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expiration (Optional)</label>
                <input
                  type="date"
                  value={formData.expiresAt || ''}
                  onChange={(e) => onChange({ expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => onChange({ isActive: e.target.checked })}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Activate Immediately</span>
                  <span className="block text-xs text-slate-500">If unchecked, alert will be saved as draft</span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-600 hover:text-slate-900 hover:bg-slate-200">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
              {isEditing ? 'Save Changes' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertsTab;
