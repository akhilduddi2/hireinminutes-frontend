import { useEffect, useState } from 'react';
import {
  ArrowLeft, Star, Clock, BookOpen, Award, User, Globe, CheckCircle,
  Play, DollarSign, Users, ChevronDown, ChevronUp
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getAuthHeaders } from '../contexts/AuthContext';

interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  level: string;
  thumbnail?: string;
  promoVideo?: string;
  price: number;
  discountPrice?: number;
  accessType: string;
  estimatedDuration: string;
  totalLessons: number;
  language: string;
  tags: string[];
  whatYouWillLearn: string[];
  certificateAvailable: boolean;
  courseContent: {
    moduleTitle: string;
    moduleDuration?: string;
    lessons?: {
      lessonTitle: string;
      lessonDuration?: string;
    }[];
  }[];
  instructorName: string;
  instructorBio?: string;
  averageRating: number;
  reviewCount: number;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    fullName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export function CourseDetailsPage() {
  // Get courseId from URL
  const courseId = window.location.pathname.split('/').pop();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchReviews();
      checkEnrollment();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/reviews/courses/${courseId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkEnrollment = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/enrollments/check/${courseId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnrollNow = async () => {
    setEnrolling(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/enrollments/enroll/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setIsEnrolled(true);
        alert('Successfully enrolled in course!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Error enrolling in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (index: number) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter(i => i !== index));
    } else {
      setExpandedModules([...expandedModules, index]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 mt-4">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Course not found</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {course.category}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${course.level === 'Beginner' ? 'bg-green-400/30 text-green-100' :
                  course.level === 'Intermediate' ? 'bg-yellow-400/30 text-yellow-100' :
                    'bg-red-400/30 text-red-100'
                  }`}>
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-white/90">
                {course.shortDescription}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <span className="font-semibold text-white">{course.averageRating.toFixed(1)}</span>
                  <span>({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.reviewCount} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.estimatedDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 pt-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Created by</div>
                  <div className="font-semibold text-lg">{course.instructorName}</div>
                </div>
              </div>
            </div>

            {/* Right: Thumbnail/Video Card */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-8">
                <div className="relative aspect-video bg-slate-900">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-16 w-16 text-white/50" />
                    </div>
                  )}
                  {course.promoVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    {course.discountPrice ? (
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-bold text-blue-600">
                            ${course.discountPrice}
                          </span>
                          <span className="text-xl text-slate-400 line-through">
                            ${course.price}
                          </span>
                        </div>
                        <div className="text-sm text-green-600 font-semibold mt-1">
                          Save ${course.price - course.discountPrice}!
                        </div>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-blue-600">
                        ${course.price}
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Already Enrolled
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                      onClick={handleEnrollNow}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-5 w-5 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </Button>
                  )}

                  <div className="text-sm text-center text-slate-600">
                    {course.accessType} access
                  </div>

                  {course.certificateAvailable && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Award className="h-5 w-5 text-green-600" />
                      <span>Certificate of completion included</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'overview'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Overview
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'curriculum'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Curriculum
                {activeTab === 'curriculum' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'reviews'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Reviews ({course.reviewCount})
                {activeTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Course */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">About this course</h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {course.fullDescription}
                  </p>
                </Card>

                {/* What You'll Learn */}
                {course.whatYouWillLearn.length > 0 && (
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Instructor */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Instructor</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {course.instructorName}
                      </h3>
                      {course.instructorBio && (
                        <p className="text-slate-600 leading-relaxed">
                          {course.instructorBio}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
                {course.courseContent.length > 0 ? (
                  <div className="space-y-3">
                    {course.courseContent.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {moduleIndex + 1}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-slate-900">
                                {module.moduleTitle}
                              </div>
                              {module.moduleDuration && (
                                <div className="text-sm text-slate-600">
                                  {module.moduleDuration} • {module.lessons?.length || 0} lessons
                                </div>
                              )}
                            </div>
                          </div>
                          {expandedModules.includes(moduleIndex) ? (
                            <ChevronUp className="h-5 w-5 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-600" />
                          )}
                        </button>

                        {expandedModules.includes(moduleIndex) && module.lessons && module.lessons.length > 0 && (
                          <div className="p-4 bg-white space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-700">{lesson.lessonTitle}</span>
                                </div>
                                {lesson.lessonDuration && (
                                  <span className="text-sm text-slate-500">
                                    {lesson.lessonDuration}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">No curriculum available yet.</p>
                )}
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <Card className="p-8">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-slate-900 mb-2">
                        {course.averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= course.averageRating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-300'
                              }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-slate-600">
                        {course.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review._id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                {review.user.fullName}
                              </h4>
                              <div className="text-sm text-slate-500">
                                {formatDate(review.createdAt)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-slate-300'
                                    }`}
                                />
                              ))}
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-slate-600">No reviews yet. Be the first to review this course!</p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Includes */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">This course includes:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>{course.estimatedDuration} on-demand content</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Available in {course.language}</span>
                </div>
                {course.certificateAvailable && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span>Certificate of completion</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-700">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span>{course.accessType} access</span>
                </div>
              </div>
            </Card>

            {/* Tags */}
            {course.tags.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
