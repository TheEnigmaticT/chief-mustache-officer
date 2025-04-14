
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { Search, Filter } from 'lucide-react';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const statusOptions = [
    { label: 'All Projects', value: 'all' },
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Planned', value: 'Planned' }
  ];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Current Projects</h1>
            <p className="text-xl max-w-3xl">
              Explore the various projects I'm currently working on, from marketing platforms 
              to educational resources and startup advisory.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-gray-700">Filter:</span>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        statusFilter === option.value
                          ? 'bg-navy text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600">No projects match your search criteria</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    technologies={project.technologies}
                    liveUrl={project.liveUrl}
                    repoUrl={project.repoUrl}
                    status={project.status}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-semibold mb-4">Interested in Working Together?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you're looking for help with your marketing strategy, growth initiatives, 
              or need expert guidance for your startup, I'd love to hear from you.
            </p>
            <a 
              href="mailto:trevor.longino@gmail.com" 
              className="btn btn-primary btn-lg"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
