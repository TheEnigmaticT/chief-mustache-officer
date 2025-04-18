
import { useState, useEffect } from 'react';

const CyclingBackgroundImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get all opart images
  const images = [
    '/img/openart-ceaa5b2983ea4ebdafeeae73331dcfa7_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_HZDb0jVj_1743562905366_raw.jpg',
    '/img/openart-254428c2-b6df-46c1-a27a-23b87bf21d21.jpg',
    '/img/openart-image_PCaQMV9E_1743564713229_raw.jpg',
    '/img/openart-image_Eks4R0Ju_1743566567866_raw.jpg',
    '/img/openart-image_Lqus96bT_1743563085861_raw.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); // 1s for fade transition
    }, 20000); // 20s interval

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div className="absolute inset-0 bg-navy bg-opacity-80 z-10"></div>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            currentImageIndex === index ? 'opacity-50' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default CyclingBackgroundImage;
