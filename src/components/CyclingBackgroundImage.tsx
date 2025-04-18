import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';

const Hero = () => {
  const cyclingImages = [
    "/img/cmo.jpg",
    '/img/openart-ceaa5b2983ea4ebdafeeae73331dcfa7_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_HZDb0jVj_1743562905366_raw.jpg',
    '/img/openart-image_PCaQMV9E_1743564713229_raw.jpg',
    '/img/openart-image_Eks4R0Ju_1743566567866_raw.jpg',
    '/img/openart-image_Lqus96bT_1743563085861_raw.jpg',
  ];

  const fallbackPaths = ["/placeholder.svg"];

  const VISIBLE_DURATION_MS = 20000; // 20 seconds
  const FADE_DURATION_MS = 1000;    // 1 second

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State to track the *next* image index, needed for layering/fade target
  const [nextImageIndex, setNextImageIndex] = useState(1 % cyclingImages.length);
   // State to control the fade transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Effect for Pre-fetching the *next* image
  useEffect(() => {
    // Calculate the index of the image *after* the next one to preload it early
    const preloadIndex = (currentImageIndex + 1) % cyclingImages.length;
    if (preloadIndex !== currentImageIndex && cyclingImages.length > 1) { // Ensure we have >1 image and aren't preloading the current one
      const img = new Image();
      img.src = cyclingImages[preloadIndex];
      // console.log("Preloading:", cyclingImages[preloadIndex]); // Optional: for debugging
    }
    // We specifically want this effect to run when the *current* image changes,
    // so we preload the *next* one in sequence.
  }, [currentImageIndex, cyclingImages]);


  // Effect for Cycling and Triggering Transitions
  useEffect(() => {
    if (cyclingImages.length <= 1) return; // Don't cycle if only one image

    const cycleInterval = setInterval(() => {
      setIsTransitioning(true); // Start the fade

      // Wait for the fade duration to complete
      const transitionTimer = setTimeout(() => {
        // Update the current index to the one that just faded in
        const newCurrentIndex = (currentImageIndex + 1) % cyclingImages.length;
        setCurrentImageIndex(newCurrentIndex);
        // Calculate the *new* next index
        setNextImageIndex((newCurrentIndex + 1) % cyclingImages.length);
        setIsTransitioning(false); // End the fade state
      }, FADE_DURATION_MS);

      // Clear timeout if component unmounts during transition
      return () => clearTimeout(transitionTimer);

    }, VISIBLE_DURATION_MS + FADE_DURATION_MS); // Total cycle time

    // Clear interval on component unmount
    return () => clearInterval(cycleInterval);

  }, [currentImageIndex, cyclingImages.length]); // Re-run effect if index or image count changes

  // Determine which image is currently "on top" (opacity 1) and "below" (opacity 0 or 1 during fade)
  const topImageIndex = isTransitioning ? nextImageIndex : currentImageIndex;
  const bottomImageIndex = isTransitioning ? currentImageIndex : nextImageIndex;

  return (
    <section className="pt-32 pb-32 bg-navy relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-fadeIn">
            {/* Text content remains the same */}
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

          {/* Image container - needs relative positioning and fixed size */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fadeIn">
            <div className="relative w-full max-w-sm h-[320px] rounded-lg shadow-xl overflow-hidden">
              {/* Bottom Image Layer (Usually the 'next' image, becomes visible during fade) */}
              {cyclingImages.length > 0 && (
                <RobustImage
                  key={cyclingImages[bottomImageIndex] + '-bottom'} // Unique key
                  src={cyclingImages[bottomImageIndex]}
                  fallbacks={fallbackPaths}
                  alt="" // Alt text primarily handled by top image when visible
                  aria-hidden="true" // Hide from screen readers when it's the bottom/hidden layer
                  className="absolute inset-0 w-full h-full object-cover" // No transition needed here
                />
              )}

              {/* Top Image Layer (Usually the 'current' image, fades out) */}
               {cyclingImages.length > 0 && (
                <RobustImage
                  key={cyclingImages[topImageIndex] + '-top'} // Unique key
                  src={cyclingImages[topImageIndex]}
                  fallbacks={fallbackPaths}
                  alt="Trevor Longino" // Primary alt text
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                  style={{ transitionDuration: `${FADE_DURATION_MS}ms` }} // Apply fade duration dynamically
                />
               )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;