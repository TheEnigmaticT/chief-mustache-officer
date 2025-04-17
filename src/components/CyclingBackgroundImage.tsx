
import { useState, useEffect } from 'react';

const CyclingBackgroundImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get all opart images
  const images = [
    '/img/opart-image-1.jpg',
    '/img/opart-image-2.jpg',
    '/img/opart-image-3.jpg',
    '/img/opart-image-4.jpg',
    '/img/opart-image-5.jpg'
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
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            currentImageIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default CyclingBackgroundImage;
