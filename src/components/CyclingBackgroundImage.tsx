import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';
// import CyclingBackgroundImage from './CyclingBackgroundImage'; // Remove this import

const Hero = () => {
  // Define the list of images to cycle through for the main image
  // Including the original cmo.jpg and removing duplicates
  const cyclingImages = [
    "/img/cmo.jpg",
    '/img/openart-ceaa5b2983ea4ebdafeeae73331dcfa7_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg', // Included only once
    '/img/openart-image_HZDb0jVj_1743562905366_raw.jpg',
    '/img/openart-image_PCaQMV9E_1743564713229_raw.jpg',
    '/img/openart-image_Eks4R0Ju_1743566567866_raw.jpg',
    '/img/openart-image_Lqus96bT_1743563085861_raw.jpg',
  ];

  // Provide generic fallbacks in case all cycling images fail
  const fallbackPaths = [
    "/placeholder.svg"
  ];

  // State to keep track of the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to handle the image cycling interval
  useEffect(() => {
    // Set an interval to change the image index
    // Adjust the interval duration (e.g., 5000ms = 5 seconds) as needed
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cyclingImages.length);
    }, 5000); // Change image every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [cyclingImages.length]); // Re-run effect if the number of images changes

  return (
    // Keep the background simple or add a static one if needed
    <section className="pt-32 pb-32 bg-navy relative overflow-hidden">
      {/* Optional: Add a static background div or overlay here if desired */}
      {/* Example: <div className="absolute inset-0 bg-navy bg-opacity-80 z-0"></div> */}

      {/* Removed <CyclingBackgroundImage /> */}
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
              // Use the image from the cycling list based on the current index
              src={cyclingImages[currentImageIndex]}
              // Use the generic placeholder as a final fallback
              fallbacks={fallbackPaths}
              alt="Trevor Longino"
              className="rounded-lg shadow-xl w-full max-w-sm object-cover relative z-20"
              // You might want to set a fixed height/aspect ratio if images differ in size
              style={{ height: '320px' }} // Example fixed height
              // Use a key to help React efficiently update when src changes, especially if RobustImage doesn't handle src changes smoothly
              key={cyclingImages[currentImageIndex]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;