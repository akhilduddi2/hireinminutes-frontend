import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, Plus, GraduationCap, Clock, Users, Edit, Trash2,
  Filter, Download, BookOpen, Star, Video
} from 'lucide-react';
import type { Course, CourseFormData } from './types';

interface CoursesTabProps {
  courses: Course[];
  coursesLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  coursesLoading,
  searchQuery,
  onSearchChange,
  onAddCourse,
  onEditCourse,
  onDeleteCourse
}) => {
  const filteredCourses = courses.filter(course =>
    searchQuery === '' ||
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: courses.length,
    activeStudents: courses.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0),
    featured: courses.filter(c => c.isFeatured).length,
    totalRevenue: '₹45.2k' // Mock revenue
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Course Library</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Manage learning paths, curate educational content, and track student progress.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onAddCourse} className="bg-indigo-500 hover:bg-indigo-600 border-none shadow-lg shadow-indigo-500/30 text-white font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
            <Button className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Courses</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Students</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{stats.activeStudents}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Featured</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.featured}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Revenue (Est)</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by title, instructor, or category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="border-slate-200 bg-white text-slate-600 flex-1 md:flex-none">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <GraduationCap className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Found</h3>
            <p className="text-slate-500 mb-6">Start building your educational catalog.</p>
            <Button onClick={onAddCourse} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course._id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold rounded-lg shadow-sm">
                      {course.category}
                    </span>
                  </div>
                  {course.isFeatured && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-400 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${course.level?.toLowerCase() === 'beginner' ? 'bg-green-50 text-green-700' :
                        course.level?.toLowerCase() === 'intermediate' ? 'bg-indigo-50 text-indigo-700' :
                          'bg-rose-50 text-rose-700'
                      }`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                    by {course.instructorName}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {course.estimatedDuration || course.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {course.enrolledStudents || 0} students
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-indigo-50 text-indigo-600 rounded-lg"
                        onClick={() => onEditCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-50 text-red-500 rounded-lg"
                        onClick={() => onDeleteCourse(course._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

// Course Modal Component
interface CourseModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: CourseFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: Partial<CourseFormData>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onChange,
  onImageChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Fill in the details below to publish your content.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 p-0">
            <span className="text-xl leading-none">&times;</span>
          </Button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                placeholder="e.g. Advanced React Patterns"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                value={formData.shortDescription || formData.description || ''}
                onChange={(e) => onChange({ shortDescription: e.target.value, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                rows={4}
                placeholder="What will students learn?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Instructor Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.instructorName || formData.instructor || ''}
                    onChange={(e) => onChange({ instructorName: e.target.value, instructor: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.estimatedDuration || formData.duration || ''}
                    onChange={(e) => onChange({ estimatedDuration: e.target.value, duration: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g. 8h 30m"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => onChange({ category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Difficulty Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => onChange({ level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => onChange({ price: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    min="0"
                    disabled={formData.isFree || formData.price === 0}
                  />
                </div>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-full">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={formData.isFree || formData.price === 0}
                    onChange={(e) => onChange({ isFree: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-900">This is a free course</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course URL (Video/Content)</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  value={formData.courseUrl || ''}
                  onChange={(e) => onChange({ courseUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-xs text-blue-600"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thumbnail Image</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm" />
                  ) : (
                    <>
                      <div className="p-3 bg-indigo-50 rounded-full text-indigo-500 mb-3">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Click to upload thumbnail</p>
                      <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={(e) => onChange({ isFeatured: e.target.checked })}
                  className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 text-sm font-medium text-slate-700">Feature this course on homepage</span>
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-600 hover:text-slate-900 hover:bg-slate-200">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
              {isEditing ? 'Save Changes' : 'Publish Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursesTab;
