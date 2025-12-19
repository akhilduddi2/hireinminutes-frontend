import { Shield, Lock, Eye, UserCheck, Bell, Database, FileText, AlertCircle } from 'lucide-react';

interface TermsPrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function TermsPrivacyPage({ onNavigate }: TermsPrivacyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy & Terms</h1>
          <p className="text-lg text-slate-600">Your trust is our priority. Learn how we protect your data and what you can expect from V Hire Today.</p>
          <p className="text-sm text-slate-500 mt-2">Last Updated: December 7, 2025</p>
        </div>

        {/* Privacy Promise Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Our Privacy Promise</h2>
              <p className="text-green-50 leading-relaxed">
                We don't sell your phone number or email to random people. Only companies you apply to will see your contact information. Your data is safe with us.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
          </div>

          <div className="space-y-6">
            {/* What We Collect */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                What Information We Collect
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <p className="text-slate-700"><strong>Profile Information:</strong> Name, email, phone number, location, skills, experience, education</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <p className="text-slate-700"><strong>Application Data:</strong> Resume, cover letter, application history</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <p className="text-slate-700"><strong>Usage Data:</strong> Pages visited, jobs viewed, search queries</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <p className="text-slate-700"><strong>Verification Data:</strong> Skills verification results, certifications</p>
                </div>
              </div>
            </div>

            {/* How We Use Data */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                How We Use Your Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p className="text-slate-700">Match you with relevant job opportunities</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p className="text-slate-700">Enable recruiters to find qualified candidates</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p className="text-slate-700">Improve our platform and services</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p className="text-slate-700">Send you notifications about applications and opportunities</p>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                When We Share Your Data
              </h3>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <p className="text-slate-700"><strong>With Recruiters:</strong> When you apply to a job, the recruiter sees your profile, resume, and contact information</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <p className="text-slate-700"><strong>Public Profile:</strong> Your shareable profile link displays non-sensitive information (no email/phone)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-slate-700"><strong>We NEVER:</strong> Sell your data to third parties, spam you with unwanted emails, or share your contact info without permission</p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                How We Protect Your Data
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🔒</span>
                  <p className="text-slate-700">Encrypted data transmission (HTTPS/SSL)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🔒</span>
                  <p className="text-slate-700">Secure password hashing and authentication</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🔒</span>
                  <p className="text-slate-700">Regular security audits and updates</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🔒</span>
                  <p className="text-slate-700">Limited access to personal data by staff</p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Your Rights & Control
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <p className="text-slate-700"><strong>Access:</strong> View all data we have about you</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <p className="text-slate-700"><strong>Update:</strong> Edit your profile information anytime</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <p className="text-slate-700"><strong>Delete:</strong> Request account and data deletion</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <p className="text-slate-700"><strong>Opt-Out:</strong> Unsubscribe from marketing emails</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms of Service Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Terms of Service</h2>
          </div>

          <div className="space-y-6">
            {/* User Responsibilities */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">User Responsibilities</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">Provide accurate and truthful information in your profile and applications</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">Keep your account credentials secure and confidential</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">Use the platform professionally and respectfully</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">Do not spam, harass, or misuse the platform</p>
                </div>
              </div>
            </div>

            {/* Recruiter Guidelines */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Recruiter Guidelines</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <p className="text-slate-700">Post genuine job opportunities only</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <p className="text-slate-700">Treat candidate information confidentially</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <p className="text-slate-700">Respond to applications in a timely manner</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <p className="text-slate-700">Do not discriminate based on protected characteristics</p>
                </div>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Prohibited Activities</h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-slate-700">Creating fake profiles or accounts</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-slate-700">Posting fraudulent job listings</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-slate-700">Scraping or harvesting user data</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-slate-700">Attempting to bypass security measures</p>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Verified Employer Badge</h3>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-slate-700 mb-2">
                      The <strong>"Verified Employer"</strong> badge indicates that we have manually reviewed and verified the company's legitimacy through:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li className="text-slate-700">• Company registration documents</li>
                      <li className="text-slate-700">• Official email domain verification</li>
                      <li className="text-slate-700">• Business address confirmation</li>
                      <li className="text-slate-700">• Employment proof verification</li>
                    </ul>
                    <p className="text-slate-600 text-sm mt-2">
                      This badge helps candidates trust genuine employers and avoid fraudulent job postings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Questions or Concerns?</h3>
          <p className="mb-4">We're here to help! Contact us about privacy or terms.</p>
          <div className="space-y-2">
            <p>Email: <a href="mailto:privacy@vhiretoday.com" className="underline font-semibold">privacy@vhiretoday.com</a></p>
            <p>Support: <a href="mailto:support@vhiretoday.com" className="underline font-semibold">support@vhiretoday.com</a></p>
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsPrivacyPage;
