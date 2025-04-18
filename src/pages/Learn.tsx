
import { useState } from 'react';
import { Filter, Search, BookOpen, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LearningCard from '../components/LearningCard';
import { learningResources } from '../data/learning';

const Learn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const typeOptions = [
    { label: 'All Resources', value: 'all' },
    { label: 'Courses', value: 'course' },
    { label: 'Mentoring', value: 'mentoring' },
    { label: 'Resources', value: 'resource' }
  ];

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn from Me</h1>
            <p className="text-xl max-w-3xl">
              Access courses, mentoring sessions, and resources designed to help founders 
              and startups succeed in their marketing journey.
            </p>
          </div>
        </section>

        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-gray-700">Filter:</span>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTypeFilter(option.value)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        typeFilter === option.value
                          ? 'bg-navy text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600">No resources match your search criteria</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource) => (
                  <LearningCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-semibold mb-4">Need Custom Support?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you're looking for personalized guidance or custom training for your team,
              let's discuss how I can help you achieve your goals.
            </p>
            <a 
              href="mailto:trevor.longino@gmail.com" 
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
