import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Plus, X, Briefcase, MapPin, DollarSign, FileText, GraduationCap, Tag } from 'lucide-react';

interface PostJobPageProps {
  onNavigate: (page: string) => void;
}

export function PostJobPage({ onNavigate }: PostJobPageProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Basic Job Info
    jobTitle: '',
    department: '',
    numberOfOpenings: 1,
    employmentType: 'full-time',
    workMode: 'onsite',
    jobLevel: 'fresher',

    // Location Details
    city: '',
    state: '',
    country: '',
    officeAddress: '',

    // Salary & Compensation
    salary: '',
    salaryType: 'annual',

    // Job Description
    roleSummary: '',
    responsibilities: [''],
    requiredSkills: [''],

    // Required Qualifications
    minimumEducation: 'bachelors',
    preferredEducation: '',
    yearsOfExperience: 0,

    // Additional Details
    benefits: [''],
    tags: [''],
    applicationDeadline: '',
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: Briefcase },
    { id: 2, title: 'Location Details', icon: MapPin },
    { id: 3, title: 'Compensation', icon: DollarSign },
    { id: 4, title: 'Job Description', icon: FileText },
    { id: 5, title: 'Requirements', icon: GraduationCap },
    { id: 6, title: 'Additional Details', icon: Tag }
  ];

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addArrayItem = (field: 'responsibilities' | 'requiredSkills' | 'benefits' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: 'responsibilities' | 'requiredSkills' | 'benefits' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: 'responsibilities' | 'requiredSkills' | 'benefits' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (formData.numberOfOpenings < 1) newErrors.numberOfOpenings = 'At least 1 opening required';
        break;

      case 2: // Location Details
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        break;

      case 3: // Compensation
        if (!formData.salary || parseFloat(formData.salary) <= 0) {
          newErrors.salary = 'Valid salary amount is required';
        }
        break;

      case 4: // Job Description
        if (!formData.roleSummary.trim()) newErrors.roleSummary = 'Role summary is required';
        if (formData.responsibilities.filter(r => r.trim()).length === 0) {
          newErrors.responsibilities = 'At least one responsibility is required';
        }
        if (formData.requiredSkills.filter(s => s.trim()).length === 0) {
          newErrors.requiredSkills = 'At least one required skill is required';
        }
        break;

      case 5: // Requirements
        if (formData.yearsOfExperience < 0) {
          newErrors.yearsOfExperience = 'Experience cannot be negative';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');

      // Prepare the job data according to the schema
      const jobData = {
        jobDetails: {
          basicInfo: {
            jobTitle: formData.jobTitle,
            department: formData.department,
            numberOfOpenings: formData.numberOfOpenings,
            employmentType: formData.employmentType,
            workMode: formData.workMode,
            jobLevel: formData.jobLevel
          },
          location: {
            city: formData.city,
            state: formData.state,
            country: formData.country,
            officeAddress: formData.officeAddress || undefined
          },
          compensation: {
            salary: parseFloat(formData.salary),
            salaryType: formData.salaryType
          },
          description: {
            roleSummary: formData.roleSummary,
            responsibilities: formData.responsibilities.filter(r => r.trim()),
            requiredSkills: formData.requiredSkills.filter(s => s.trim())
          },
          qualifications: {
            minimumEducation: formData.minimumEducation,
            preferredEducation: formData.preferredEducation || undefined,
            yearsOfExperience: formData.yearsOfExperience
          }
        },
        benefits: formData.benefits.filter(b => b.trim()),
        tags: formData.tags.filter(t => t.trim()),
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
        status: 'active'
      };

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error('Failed to post job');
      }

      alert('Job posted successfully!');
      onNavigate('recruiter-dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData('jobTitle', e.target.value)}
                  className={errors.jobTitle ? 'border-red-500' : ''}
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Engineering, Marketing, Sales"
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  className={errors.department ? 'border-red-500' : ''}
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Openings *
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.numberOfOpenings}
                  onChange={(e) => updateFormData('numberOfOpenings', parseInt(e.target.value) || 1)}
                  className={errors.numberOfOpenings ? 'border-red-500' : ''}
                />
                {errors.numberOfOpenings && <p className="text-red-500 text-sm mt-1">{errors.numberOfOpenings}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employment Type *
                </label>
                <Select
                  value={formData.employmentType}
                  onChange={(value) => updateFormData('employmentType', value)}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Mode *
                </label>
                <Select
                  value={formData.workMode}
                  onChange={(value) => updateFormData('workMode', value)}
                >
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Level *
              </label>
              <Select
                value={formData.jobLevel}
                onChange={(value) => updateFormData('jobLevel', value)}
              >
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="director">Director</option>
              </Select>
            </div>
          </div>
        );

      case 2: // Location Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., New York"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., California"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., United States"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Office Address (Optional)
              </label>
              <Textarea
                placeholder="Complete office address for on-site roles"
                value={formData.officeAddress}
                onChange={(e) => updateFormData('officeAddress', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 3: // Compensation
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Salary Amount *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 75000"
                  value={formData.salary}
                  onChange={(e) => updateFormData('salary', e.target.value)}
                  className={errors.salary ? 'border-red-500' : ''}
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Salary Type *
                </label>
                <Select
                  value={formData.salaryType}
                  onChange={(value) => updateFormData('salaryType', value)}
                >
                  <option value="annual">Annual</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Salary Display:</strong> {formData.salary ? `${formData.salaryType === 'annual' ? '$' + formData.salary + ' per year' : formData.salaryType === 'monthly' ? '$' + formData.salary + ' per month' : '$' + formData.salary + ' per hour'}` : 'Enter salary to see preview'}
              </p>
            </div>
          </div>
        );

      case 4: // Job Description
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role Summary *
              </label>
              <Textarea
                placeholder="Brief overview of the role and what the candidate will be doing..."
                value={formData.roleSummary}
                onChange={(e) => updateFormData('roleSummary', e.target.value)}
                rows={4}
                className={errors.roleSummary ? 'border-red-500' : ''}
              />
              {errors.roleSummary && <p className="text-red-500 text-sm mt-1">{errors.roleSummary}</p>}
              <p className="text-sm text-slate-500 mt-1">Maximum 1000 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Responsibilities *
              </label>
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Responsibility ${index + 1}`}
                    value={responsibility}
                    onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                    className={errors.responsibilities ? 'border-red-500' : ''}
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('responsibilities', index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('responsibilities')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Responsibility
              </Button>
              {errors.responsibilities && <p className="text-red-500 text-sm mt-1">{errors.responsibilities}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills *
              </label>
              {formData.requiredSkills.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Skill ${index + 1} (e.g., JavaScript, React, Node.js)`}
                    value={skill}
                    onChange={(e) => updateArrayItem('requiredSkills', index, e.target.value)}
                    className={errors.requiredSkills ? 'border-red-500' : ''}
                  />
                  {formData.requiredSkills.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('requiredSkills', index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('requiredSkills')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
              {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>}
            </div>
          </div>
        );

      case 5: // Requirements
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Education *
                </label>
                <Select
                  value={formData.minimumEducation}
                  onChange={(value) => updateFormData('minimumEducation', value)}
                >
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Education (Optional)
                </label>
                <Select
                  value={formData.preferredEducation}
                  onChange={(value) => updateFormData('preferredEducation', value)}
                >
                  <option value="">Not specified</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience Required *
              </label>
              <Input
                type="number"
                min="0"
                max="50"
                placeholder="e.g., 3"
                value={formData.yearsOfExperience}
                onChange={(e) => updateFormData('yearsOfExperience', parseInt(e.target.value) || 0)}
                className={errors.yearsOfExperience ? 'border-red-500' : ''}
              />
              {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
              <p className="text-sm text-slate-500 mt-1">Use 0 for fresher positions</p>
            </div>
          </div>
        );

      case 6: // Additional Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Benefits & Perks
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Benefit ${index + 1} (e.g., Health Insurance, Remote Work)`}
                    value={benefit}
                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('benefits')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags (for better discoverability)
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Tag ${index + 1} (e.g., React, Frontend, Startup)`}
                    value={tag}
                    onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                  />
                  {formData.tags.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('tags')}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Application Deadline (Optional)
              </label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-slate-500 mt-1">Leave empty for no deadline</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => onNavigate('recruiter-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
            <p className="text-slate-600">Fill in the details to attract the best candidates</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' :
                        'bg-slate-200 text-slate-600'
                    }`}>
                    {isCompleted ? <span className="text-sm font-bold">✓</span> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <p className="text-slate-600">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="bg-slate-900 hover:bg-slate-800">
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Posting Job...' : 'Post Job'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}