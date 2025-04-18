import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';

const Hero = () => {
  // Memoize the image list to prevent potential issues if the component re-renders unnecessarily
  // Ensures the array identity is stable unless explicitly changed.
  const cyclingImages = useMemo(() => [
    "/img/cmo.jpg",
    '/img/openart-ceaa5b2983ea4ebdafeeae73331dcfa7_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_HZDb0jVj_1743562905366_raw.jpg',
    '/img/openart-image_PCaQMV9E_1743564713229_raw.jpg',
    '/img/openart-image_Eks4R0Ju_1743566567866_raw.jpg',
    '/img/openart-image_Lqus96bT_1743563085861_raw.jpg',
  ], []); // Empty dependency array means this runs only on initial mount

  // Memoize fallback paths as well
  const fallbackPaths = useMemo(() => ["/placeholder.svg"], []);

  const VISIBLE_DURATION_MS = 20000; // 20 seconds
  const FADE_DURATION_MS = 1000;    // 1 second (adjust as needed)

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate the next index - this is the image that will be preloaded/shown underneath
  // useMemo ensures this calculation only happens when dependencies change
  const nextImageIndex = useMemo(() => {
    if (cyclingImages.length <= 1) return 0; // Handle edge case of 0 or 1 image
    return (currentImageIndex + 1) % cyclingImages.length;
  }, [currentImageIndex, cyclingImages]); // Re-calculate when current index or images change

  // Effect for Pre-fetching the *next* image (the one that will be revealed)
  useEffect(() => {
    // Only run if there are multiple images
    if (cyclingImages.length <= 1) return;

    // Preload the image that's currently assigned to the bottom layer
    const img = new Image();
    img.src = cyclingImages[nextImageIndex];
    // console.log(`Preloading/Ensuring loaded index ${nextImageIndex}: ${cyclingImages[nextImageIndex]}`); // Optional: for debugging

    // This effect runs whenever nextImageIndex changes (due to currentImageIndex changing)
  }, [nextImageIndex, cyclingImages]); // Depend on the calculated next index and the image list


  // Effect for Cycling and Triggering Transitions
  useEffect(() => {
    if (cyclingImages.length <= 1) return; // Don't cycle if only one image

    // Calculate the total time for one cycle (visible time + fade time)
    const totalCycleTime = VISIBLE_DURATION_MS + FADE_DURATION_MS;

    // Set interval for starting the transition
    const cycleTimer = setInterval(() => {
      setIsTransitioning(true); // Trigger the fade-out of the top image

      // Set a timeout to run *after* the fade duration
      const transitionEndTimer = setTimeout(() => {
        // Update the current index to the one that was just revealed
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % cyclingImages.length);
        // End the transition state - top image will now instantly show the new current image at full opacity
        setIsTransitioning(false);
      }, FADE_DURATION_MS);

      // Cleanup function for the timeout
      return () => clearTimeout(transitionEndTimer);

    }, totalCycleTime); // Interval waits for the full cycle duration before starting the next fade

    // Cleanup function for the interval
    return () => clearInterval(cycleTimer);

    // Dependencies for the effect
  }, [cyclingImages.length, FADE_DURATION_MS, VISIBLE_DURATION_MS]);


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

          {/* Image container */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-fadeIn">
             {/* Container div: Provides positioning context and visual frame */}
            <div className="relative w-full max-w-sm h-[320px] rounded-lg shadow-xl overflow-hidden bg-gray-800"> {/* Added subtle bg for loading fallback */}
              {/* Bottom Image Layer (The 'next' image, always present underneath) */}
              {cyclingImages.length > 0 && (
                <RobustImage
                  // Key changes when the *next* image index changes
                  key={`img-bottom-${nextImageIndex}`}
                  src={cyclingImages[nextImageIndex]}
                  fallbacks={fallbackPaths}
                  alt="" // Purely decorative when hidden
                  aria-hidden="true" // Hide from accessibility tree
                  // Always positioned absolutely, full size, fully opaque. It gets revealed by the top layer fading.
                  className="absolute inset-0 w-full h-full object-cover opacity-100"
                />
              )}

              {/* Top Image Layer (The 'current' image, fades out to reveal the bottom layer) */}
              {cyclingImages.length > 0 && (
                <RobustImage
                  // Key changes when the *current* image index changes
                  key={`img-top-${currentImageIndex}`}
                  src={cyclingImages[currentImageIndex]}
                  fallbacks={fallbackPaths}
                  alt="Trevor Longino" // Describes the visually current image
                  // Controls visibility: Fully opaque normally, fades to transparent during transition.
                  // Added pointer-events-none when transitioning to ensure interaction goes to elements below if needed.
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${
                    isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  // Dynamic transition duration based on constant
                  style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
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