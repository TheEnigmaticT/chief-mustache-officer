
import { useState } from 'react';
import Hero from '../components/Hero';
import FeaturedContent from '../components/FeaturedContent';
import TestimonialCard from '../components/TestimonialCard';
import ProjectCard from '../components/ProjectCard';
import { testimonials } from '../data/testimonials';
import { featuredProjects } from '../data/projects';
import { featuredBlogPosts, featuredVideos } from '../data/publications';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  const [displayedTestimonials, setDisplayedTestimonials] = useState(testimonials.slice(0, 3));
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const toggleTestimonials = () => {
    if (showAllTestimonials) {
      setDisplayedTestimonials(testimonials.slice(0, 3));
    } else {
      setDisplayedTestimonials(testimonials);
    }
    setShowAllTestimonials(!showAllTestimonials);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <FeaturedContent 
          featuredPosts={featuredBlogPosts}
          featuredVideos={featuredVideos}
        />

        {/* Projects Section */}
        <section className="section bg-gray-50">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Current Projects</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Here are some of the exciting projects I'm currently working on
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
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
            
            <div className="mt-12 text-center">
              <Link 
                to="/projects" 
                className="btn btn-primary btn-lg"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">What People Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Feedback from clients and collaborators I've worked with
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedTestimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  text={testimonial.text}
                  author={testimonial.author}
                  position={testimonial.position}
                  company={testimonial.company}
                />
              ))}
            </div>
            
            {testimonials.length > 3 && (
              <div className="mt-12 text-center">
                <button 
                  onClick={toggleTestimonials}
                  className="btn btn-outline btn-lg"
                >
                  {showAllTestimonials ? "Show Less" : "View More Testimonials"}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
