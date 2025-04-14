
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use a different image for the logo to avoid previous issues
  const logoImagePath = "/lovable-uploads/image-3";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Preload the logo image
  useEffect(() => {
    // Reset states when image source changes
    setLogoLoaded(false);
    setLogoError(false);
    
    // Create new image for preloading
    const img = new Image();
    img.src = logoImagePath;
    
    // Handle successful load
    img.onload = () => {
      setLogoLoaded(true);
      console.log("Logo image loaded successfully:", logoImagePath);
    };
    
    // Handle loading error
    img.onerror = () => {
      console.error("Failed to load logo image:", logoImagePath);
      setLogoError(true);
    };
    
    // Check if image is already cached
    if (imgRef.current && imgRef.current.complete) {
      setLogoLoaded(true);
      console.log("Logo image was already cached");
    }
    
    return () => {
      // Clean up event listeners
      img.onload = null;
      img.onerror = null;
    };
  }, [logoImagePath]);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              ref={imgRef}
              src={logoImagePath}
              alt="Chief Mustache Officer"
              className="h-8 rounded-full"
              loading="eager"
              onError={(e) => {
                console.error("Logo image failed to load, trying fallback");
                const target = e.target as HTMLImageElement;
                target.src = "/lovable-uploads/image-6";
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-navy hover:text-mustache transition-colors font-medium">
              Home
            </Link>
            <Link to="/cv" className="text-navy hover:text-mustache transition-colors font-medium">
              CV
            </Link>
            <Link to="/publications" className="text-navy hover:text-mustache transition-colors font-medium">
              Publications
            </Link>
            <Link to="/projects" className="text-navy hover:text-mustache transition-colors font-medium">
              Projects
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-navy hover:text-mustache"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col container mx-auto px-4 py-4">
            <Link 
              to="/" 
              className="py-3 text-navy hover:text-mustache transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/cv" 
              className="py-3 text-navy hover:text-mustache transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              CV
            </Link>
            <Link 
              to="/publications" 
              className="py-3 text-navy hover:text-mustache transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Publications
            </Link>
            <Link 
              to="/projects" 
              className="py-3 text-navy hover:text-mustache transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
