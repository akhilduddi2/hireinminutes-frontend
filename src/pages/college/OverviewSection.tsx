import React from 'react';
import { Users, CheckCircle, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Student, CollegeProfile } from './types';

interface OverviewSectionProps {
  profile: CollegeProfile | null;
  students: Student[];
  user: any;
  onViewAllStudents: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  profile,
  students,
  user,
  onViewAllStudents
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.isVerified).length}
              </p>
              <p className="text-sm text-gray-600">Verified Students</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.reduce((acc, s) => acc + (s.profile?.skills?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Skills Listed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* College Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">College Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {profile?.name || (user && 'name' in user ? (user as any).name : 'Loading...')}</p>
              <p><span className="font-medium">Email:</span> {profile?.email || (user && 'email' in user ? (user as any).email : 'Loading...')}</p>
              <p><span className="font-medium">Phone:</span> {profile?.contactNumber || 'Not provided'}</p>
              <p><span className="font-medium">Website:</span> {profile?.website || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">City:</span> {profile?.address?.city}</p>
              <p><span className="font-medium">Country:</span> {profile?.address?.country}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Students */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Students</h2>
          <Button onClick={onViewAllStudents}>
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {students.length > 0 ? (
            students.slice(0, 3).map((student) => (
              <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.fullName}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {student.isVerified && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No students found. Start by adding your first student!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OverviewSection;
