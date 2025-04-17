import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';
import CyclingBackgroundImage from './CyclingBackgroundImage';

const Hero = () => {
  // Provide multiple fallbacks
  const fallbackPaths = [
    "/placeholder.svg"
  ];
  
  // Define possible image paths
  const possibleImagePaths = [
    "/img/cmo.jpg",
    "/img/image-2.png",
    "/img/image-3.png"
  ];

  return (
    <section className="pt-32 pb-32 bg-gradient-to-br from-navy to-navy-light relative overflow-hidden">
      <CyclingBackgroundImage />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Trevor Longino
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-mustache mb-6">
              The AI-powered CMO (That's "Chief Mustache Officer")
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              I've launched 130 startups, mentored thousands, and built 119 million-dollar 
              marketing engines. I help startups grow from $0 to $3MM+ ARR.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cv" className="btn btn-primary btn-lg">
                View My CV
              </Link>
              <Link to="/projects" className="btn btn-outline btn-lg border-white hover:bg-white/10">
                See My Projects
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fadeIn">
            <RobustImage 
              src="/img/cmo.jpg"
              fallbacks={possibleImagePaths.slice(1).concat(fallbackPaths)}
              alt="Trevor Longino" 
              className="rounded-lg shadow-xl w-full max-w-sm object-cover"
              height="320px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
