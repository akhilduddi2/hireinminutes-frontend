
import React from 'react';
import { getApiUrl } from '../../config/api';
import { Button } from '../../components/ui/Button';
import {
  Search, Plus, Megaphone, Edit, Trash2, ExternalLink, Layout, Image as ImageIcon, Pause, Play, Loader2
} from 'lucide-react';
import type { Ad, AdFormData } from './types';

interface AdsTabProps {
  ads: Ad[];
  adsLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddAd: () => void;
  onEditAd: (ad: Ad) => void;
  onDeleteAd: (id: string) => void;
  onTogglePause: (id: string) => void;
  onViewImage: (imageUrl: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const AdsTab: React.FC<AdsTabProps> = ({
  ads,
  adsLoading,
  searchQuery,
  onSearchChange,
  onAddAd,
  onEditAd,
  onDeleteAd,
  onTogglePause,
  onViewImage,
  hasMore,
  onLoadMore
}) => {
  const filteredAds = ads.filter(ad =>
    searchQuery === '' ||
    ad.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ad.placement || ad.adType)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.isActive).length,
    impressions: ads.reduce((acc, curr) => acc + (curr.impressions || 0), 0),
    clicks: ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0)
  };

  if (adsLoading && ads.length === 0) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Header Skeleton */}
        <div className="rounded-3xl bg-slate-200 h-48"></div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="aspect-square bg-slate-100"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-3 bg-slate-50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 text-white p-4 sm:p-5 md:p-6 shadow-lg ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-bold mb-1.5 md:mb-2 tracking-tight">Ad Campaigns</h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Manage advertisements, track performance, and optimize revenue streams.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={onAddAd}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-4 sm:px-6 transition-all w-full md:w-auto text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Campaign</span>
              <span className="sm:hidden">New Ad</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Active Ad Units</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{stats.active} <span className="text-xs text-slate-500 font-normal">/ {stats.total}</span></p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Total Impressions</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{stats.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Total Clicks</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{stats.clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Avg CTR</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">
              {stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : '0.00'}%
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-full px-4 sm:px-6 w-full sm:w-auto justify-center transition-all text-sm"
          >
            <Layout className="h-4 w-4 mr-2" />
            <span>View All Placements</span>
          </Button>
        </div>
      </div>

      {filteredAds.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 md:p-16 text-center shadow-sm">
          <Megaphone className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">No active campaigns</h3>
          <p className="text-sm sm:text-base text-slate-500 mb-6">Create your first advertisement to start tracking metrics.</p>
          <Button
            onClick={onAddAd}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-6 w-full sm:w-auto transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Launch Campaign</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAds.map((ad) => (
            <div key={ad._id} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all duration-300 flex flex-col">
              {/* Image Area */}
              <div
                className="relative aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-white cursor-pointer overflow-hidden group/img flex-shrink-0"
                onClick={() => onViewImage(ad.imageUrl || getApiUrl(`/api/ads/${ad._id}/image`))}
              >
                <img
                  src={ad.imageUrl || getApiUrl(`/api/ads/${ad._id}/image`)}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.ad-image-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                    if (fallback) fallback.classList.add('flex');
                  }}
                />
                <div className="ad-image-fallback hidden flex-col items-center justify-center h-full text-slate-400 absolute inset-0 bg-slate-50">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                  <span className="text-xs mt-1">No Image</span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {ad.isPaused && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full shadow-lg bg-amber-500 text-white">
                      Paused
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-lg ${ad.isActive && !ad.isPaused ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                    {ad.isActive && !ad.isPaused ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-slate-900 mb-2 line-clamp-2" title={ad.title}>
                  {ad.title}
                </h3>

                <span className="inline-block px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase mb-3 w-fit">
                  {ad.placement || ad.adType}
                </span>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Views</p>
                    <p className="text-base font-bold text-slate-900">{ad.impressions?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Clicks</p>
                    <p className="text-base font-bold text-slate-900">{ad.clicks?.toLocaleString() || 0}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors py-2 border-none"
                    onClick={() => onEditAd(ad)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    className={`${ad.isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'} text-white rounded-full transition-colors px-3 py-2 border-none`}
                    onClick={() => onTogglePause(ad._id)}
                    title={ad.isPaused ? 'Resume ad' : 'Pause ad'}
                  >
                    {ad.isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors px-3 py-2 border-none"
                    onClick={() => onDeleteAd(ad._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
          }
        </div >
      )}

      {hasMore && onLoadMore && !adsLoading && (
        <div className="flex justify-center pt-6 border-t border-slate-100 mt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="px-8 py-2.5 rounded-full border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
          >
            Load More Campaigns
          </Button>
        </div>
      )}

    </div >
  );
};

// Ad Modal Component
interface AdModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: AdFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<AdFormData>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onChange,
  onImageChange,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-start sm:items-center bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Campaign' : 'New Campaign'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Configure ad placement and creative.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 rounded-full h-8 w-8 p-0 shrink-0">
            <span className="text-xl leading-none">&times;</span>
          </Button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Campaign Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                placeholder="e.g. Summer Promo Banner"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Destination URL</label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={formData.linkUrl || formData.ctaUrl || ''}
                  onChange={(e) => onChange({ linkUrl: e.target.value, ctaUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="https://example.com/promo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Required)</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium resize-none"
                placeholder="Brief description of the ad content (internal use)"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Button Text</label>
                <input
                  type="text"
                  value={formData.ctaText || 'Learn More'}
                  onChange={(e) => onChange({ ctaText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority || 1}
                  onChange={(e) => onChange({ priority: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ad Placement</label>
                <div className="relative">
                  <select
                    value={formData.placement || formData.adType || ''}
                    onChange={(e) => onChange({ placement: e.target.value, adType: e.target.value as 'popup' | 'banner' })}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none"
                    required
                  >
                    <option value="">Select Target Placement</option>
                    <option value="home-banner">Home Page Banner</option>
                    <option value="sidebar">Sidebar Widget</option>
                    <option value="jobs-page">Jobs Feed Interstitial</option>
                    <option value="fullscreen-modal">Full Screen Modal</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Screen Modal Specific Settings */}
            {(formData.placement === 'fullscreen-modal' || formData.adType === 'fullscreen-modal') && (
              <div className="space-y-5 p-5 bg-rose-50/50 border border-rose-100 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  Full-Screen Modal Settings
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Delay (Seconds)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.modalDelay ?? 0}
                      onChange={(e) => onChange({ modalDelay: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      placeholder="e.g. 3"
                    />
                    <p className="text-xs text-slate-500 mt-1">Seconds to wait before showing modal</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Close Behavior</label>
                    <select
                      value={formData.modalCloseBehavior || 'closeable'}
                      onChange={(e) => onChange({ modalCloseBehavior: e.target.value as 'closeable' | 'auto-close' | 'both' })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none"
                    >
                      <option value="closeable">User Can Close</option>
                      <option value="auto-close">Auto-Close Only</option>
                      <option value="both">Both (User + Auto)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">How users can dismiss the modal</p>
                  </div>
                </div>

                {(formData.modalCloseBehavior === 'auto-close' || formData.modalCloseBehavior === 'both') && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Auto-Close After (Seconds)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.modalAutoCloseDelay ?? ''}
                      onChange={(e) => onChange({ modalAutoCloseDelay: parseInt(e.target.value) || undefined })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      placeholder="e.g. 10"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">Modal will automatically close after this duration</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Duration (Sec)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayDuration || ''}
                  onChange={(e) => onChange({ displayDuration: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  placeholder="e.g. 15"
                />
                <p className="text-xs text-slate-400 mt-1">Total time the ad will appear.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unskippable (Sec)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.unskippableDuration || ''}
                  onChange={(e) => onChange({ unskippableDuration: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  placeholder="e.g. 5"
                />
                <p className="text-xs text-slate-400 mt-1">Min time before ad can be closed.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency (Sec)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.frequency || ''}
                  onChange={(e) => onChange({ frequency: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  placeholder="e.g. 60"
                />
                <p className="text-xs text-slate-400 mt-1">Show again every X seconds.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Creative Asset</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {(formData.imageUrl || formData.image) ? (
                  <div className="relative group">
                    <img src={formData.imageUrl || formData.image} alt="Preview" className="h-32 mx-auto rounded-lg shadow-sm object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <p className="text-white text-xs font-bold">Click to Replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Drag & drop or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">Recommended size: 1200x600px</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => onChange({ startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => onChange({ endDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  id="adIsActive"
                  checked={formData.isActive}
                  onChange={(e) => onChange({ isActive: e.target.checked })}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Active Status</span>
                  <span className="block text-xs text-slate-500">Enable this campaign immediately</span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl sticky bottom-0 z-10 flex justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-full px-6 transition-all"
            >
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-6 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Launch Campaign'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Image Modal Component
interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-8 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-[90vh]">
        <Button
          className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
          variant="ghost"
          onClick={onClose}
        >
          <span className="text-2xl leading-none">&times;</span>
        </Button>
        <img
          src={imageUrl}
          alt="Full size creative"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
        />
        <p className="text-white/50 text-center mt-4 text-sm font-medium">Click anywhere to close</p>
      </div>
    </div>
  );
};

export default AdsTab;
