import React from 'react';
import { UserPlus, Filter, Eye, Edit3, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Student } from './types';

interface StudentsSectionProps {
  students: Student[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddStudent: () => void;
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentsSection: React.FC<StudentsSectionProps> = ({
  students,
  searchTerm,
  onSearchChange,
  onAddStudent,
  onViewStudent,
  onEditStudent
}) => {
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        <Button onClick={onAddStudent}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {student.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.fullName}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {student.profile?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.profile.phone}
                        </span>
                      )}
                      {student.profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {student.profile.location.city}, {student.profile.location.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {student.isVerified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onViewStudent?.(student)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditStudent?.(student)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Skills */}
              {student.profile?.skills && student.profile.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <p>No students found matching your search.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
