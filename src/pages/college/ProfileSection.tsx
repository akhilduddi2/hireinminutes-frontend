import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { getApiUrl } from '../../config/api';
import type { CollegeProfile } from './types';

interface ProfileSectionProps {
  profile: CollegeProfile | null;
  onProfileUpdate?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onProfileUpdate }) => {
  console.log('ProfileSection received profile:', profile);
  console.log('ProfileSection received profile:', profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    contactNumber: profile?.contactNumber || '',
    website: profile?.website || '',
    description: profile?.description || '',
    accreditation: profile?.accreditation || '',
    establishedYear: profile?.establishedYear?.toString() || '',
    address: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      country: profile?.address?.country || '',
      zipCode: profile?.address?.zipCode || ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl()}/api/college/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined
        })
      });

      if (response.ok) {
        setIsEditing(false);
        onProfileUpdate?.();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      contactNumber: profile?.contactNumber || '',
      website: profile?.website || '',
      description: profile?.description || '',
      accreditation: profile?.accreditation || '',
      establishedYear: profile?.establishedYear?.toString() || '',
      address: {
        street: profile?.address?.street || '',
        city: profile?.address?.city || '',
        state: profile?.address?.state || '',
        country: profile?.address?.country || '',
        zipCode: profile?.address?.zipCode || ''
      }
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">College Profile</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              <Input value={profile?.name || 'Not provided'} readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input value={profile?.email || 'Not provided'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            {isEditing ? (
              <Input
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="Enter contact number"
              />
            ) : (
              <Input value={profile?.contactNumber || 'Not provided'} readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            {isEditing ? (
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            ) : (
              <Input value={profile?.website || 'Not provided'} readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accreditation</label>
            {isEditing ? (
              <Input
                value={formData.accreditation}
                onChange={(e) => handleInputChange('accreditation', e.target.value)}
                placeholder="Enter accreditation"
              />
            ) : (
              <Input value={profile?.accreditation || 'Not provided'} readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                placeholder="2020"
              />
            ) : (
              <Input value={profile?.establishedYear?.toString() || 'Not provided'} readOnly />
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
              {isEditing ? (
                <Input
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="Enter street address"
                />
              ) : (
                <Input value={profile?.address?.street || 'Not provided'} readOnly />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              {isEditing ? (
                <Input
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Enter city"
                />
              ) : (
                <Input value={profile?.address?.city || 'Not provided'} readOnly />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              {isEditing ? (
                <Input
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="Enter state"
                />
              ) : (
                <Input value={profile?.address?.state || 'Not provided'} readOnly />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              {isEditing ? (
                <Input
                  value={formData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  placeholder="Enter country"
                />
              ) : (
                <Input value={profile?.address?.country || 'Not provided'} readOnly />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              {isEditing ? (
                <Input
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              ) : (
                <Input value={profile?.address?.zipCode || 'Not provided'} readOnly />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {isEditing ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter college description"
            />
          ) : (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
              value={profile?.description || 'Not provided'}
              readOnly
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
