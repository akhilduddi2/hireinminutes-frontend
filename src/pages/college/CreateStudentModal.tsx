import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { NewStudent } from './types';

interface CreateStudentModalProps {
  isOpen: boolean;
  newStudent: NewStudent;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<NewStudent>) => void;
}

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  newStudent,
  onClose,
  onSubmit,
  onChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input
              value={newStudent.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              required
              placeholder="Enter student's full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={newStudent.email}
              onChange={(e) => onChange({ email: e.target.value })}
              required
              placeholder="Enter student's email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              type="password"
              value={newStudent.password}
              onChange={(e) => onChange({ password: e.target.value })}
              required
              placeholder="Enter a password for the student"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Student
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateStudentModal;
