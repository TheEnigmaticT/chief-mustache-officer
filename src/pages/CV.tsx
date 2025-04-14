
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cvData } from '../data/cv';
import { FileText, Mail, Phone, Linkedin, Globe, Calendar, MapPin } from 'lucide-react';

const CV = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'education'>('experience');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{cvData.name}</h1>
                <h2 className="text-xl text-mustache mb-4">{cvData.title}</h2>
                <p className="max-w-2xl mb-6">{cvData.summary}</p>
              </div>
              <div className="mt-4 md:mt-0 grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <Mail className="text-mustache mr-3" size={18} />
                  <a href={`mailto:${cvData.contact.email}`} className="hover:text-mustache transition-colors">
                    {cvData.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="text-mustache mr-3" size={18} />
                  <a href={`tel:${cvData.contact.phone}`} className="hover:text-mustache transition-colors">
                    {cvData.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Linkedin className="text-mustache mr-3" size={18} />
                  <a 
                    href={`https://${cvData.contact.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mustache transition-colors"
                  >
                    {cvData.contact.linkedin}
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="text-mustache mr-3" size={18} />
                  <a 
                    href={`https://${cvData.contact.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mustache transition-colors"
                  >
                    {cvData.contact.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex overflow-x-auto space-x-4">
              <button 
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'experience' 
                    ? 'border-mustache text-navy' 
                    : 'border-transparent text-gray-500 hover:text-navy'
                }`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </button>
              <button 
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'skills' 
                    ? 'border-mustache text-navy' 
                    : 'border-transparent text-gray-500 hover:text-navy'
                }`}
                onClick={() => setActiveTab('skills')}
              >
                Skills & Publications
              </button>
              <button 
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'education' 
                    ? 'border-mustache text-navy' 
                    : 'border-transparent text-gray-500 hover:text-navy'
                }`}
                onClick={() => setActiveTab('education')}
              >
                Education & Languages
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {activeTab === 'experience' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-8 text-navy">Professional Experience</h2>
                <div className="space-y-10">
                  {cvData.experience.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-navy">{job.role}</h3>
                          <h4 className="text-lg font-medium text-mustache">{job.company}</h4>
                        </div>
                        <div className="flex flex-col items-end space-y-1 text-gray-600 text-sm mt-2 md:mt-0">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{job.period}</span>
                          </div>
                          {job.location && (
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span>{job.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      {job.achievements && job.achievements.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-navy mb-2">Key Achievements:</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {job.achievements.map((achievement, index) => (
                              <li key={index} className="text-gray-700">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-navy">Skills & Expertise</h2>
                    <div className="space-y-6">
                      {cvData.skills.map((skillGroup, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-mustache mb-4">{skillGroup.category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills.map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 text-navy px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-navy">Publications</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <ul className="space-y-4">
                        {cvData.publications.map((publication, index) => (
                          <li key={index} className="flex items-start">
                            <FileText className="text-mustache mr-3 mt-1 flex-shrink-0" size={18} />
                            <div>
                              {publication.url ? (
                                <a 
                                  href={publication.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-navy hover:text-mustache"
                                >
                                  {publication.title}
                                </a>
                              ) : (
                                <span className="text-navy">{publication.title}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-navy">Education</h2>
                    <div className="space-y-6">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-semibold text-navy mb-1">{edu.institution}</h3>
                          <p className="text-mustache mb-2">{edu.degree}</p>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Calendar size={14} className="mr-1" />
                            <span>{edu.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-navy">Languages</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <ul className="space-y-4">
                        {cvData.languages.map((lang, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span className="text-navy font-medium">{lang.language}</span>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {lang.level}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 text-center">
              <a 
                href="#" 
                className="btn btn-primary btn-lg inline-flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  window.print();
                }}
              >
                <FileText size={18} className="mr-2" />
                Download PDF Version
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CV;
