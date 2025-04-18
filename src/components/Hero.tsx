
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
    '/img/openart-ceaa5b2983ea4ebdafeeae73331dcfa7_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_HZDb0jVj_1743562905366_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_PCaQMV9E_1743564713229_raw.jpg',
    '/img/openart-image_Eks4R0Ju_1743566567866_raw.jpg',
    '/img/openart-image_Lqus96bT_1743563085861_raw.jpg',
  ];

  return (
    <section className="pt-32 pb-32 bg-navy relative overflow-hidden">
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
              I've built 119 million-dollar marketing engines for everything from new startups to trillion-dollar banks. Wanna learn how?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cv" className="btn btn-primary btn-lg">
                Learn about me
              </Link>
              <Link to="/projects" className="btn btn-outline btn-lg border-white hover:bg-white/10">
                See What I'm Building
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fadeIn">
            <RobustImage 
              src="/img/cmo.jpg"
              fallbacks={possibleImagePaths.slice(1).concat(fallbackPaths)}
              alt="Trevor Longino" 
              className="rounded-lg shadow-xl w-full max-w-sm object-cover relative z-20"
              height="320px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
