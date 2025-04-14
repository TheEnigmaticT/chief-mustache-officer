
import { useState, useEffect } from 'react';
import { ArrowDownCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const heroImageUrl = imageError ? "/lovable-uploads/image-2" : "/lovable-uploads/image-1";
  
  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = heroImageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error("Failed to load hero image");
      setImageError(true);
    };
  }, [heroImageUrl]);

  return (
    <section className="pt-24 pb-16 md:py-32 bg-gradient-to-br from-navy to-navy-light">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Trevor Longino
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-mustache mb-6">
              AI-powered CMO with 20+ years GTM experience
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              I've launched 130 startups, mentored thousands, and built 119 million-dollar 
              marketing engines. I help startups grow from $0 to $3MM+ ARR.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cv" className="btn btn-primary btn-lg">
                View My CV
              </Link>
              <Link to="/projects" className="btn btn-outline btn-lg text-white border-white hover:bg-white/10">
                See My Projects
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fadeIn">
            {imageLoaded ? (
              <img 
                src={heroImageUrl} 
                alt="Trevor Longino" 
                className="rounded-lg shadow-xl w-full max-w-sm object-cover"
                loading="eager"
              />
            ) : (
              <div className="rounded-lg shadow-xl w-full max-w-sm h-80 bg-gray-300 animate-pulse"></div>
            )}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <a 
            href="#content" 
            className="text-white hover:text-mustache transition-all transform hover:translate-y-1"
            aria-label="Scroll down"
          >
            <ArrowDownCircle size={40} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
