import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use a different image for the logo to avoid previous issues
  const logoImagePath = "http://chiefmustacheofficer.com/images/ChiefMustacheOfficer_Logo_Horizontal.png";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Preload the logo image
  useEffect(() => {
    setLogoLoaded(false);
    setLogoError(false);

    const img = new Image();
    img.src = logoImagePath;

    img.onload = () => {
      setLogoLoaded(true);
      console.log("Logo image loaded successfully:", logoImagePath);
    };

    img.onerror = () => {
      console.error("Failed to load logo image:", logoImagePath);
      setLogoError(true);
    };

    return () => {
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
                target.src = "/lovable-uploads/image-6.png"; // Add the correct file extension
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
            aria-expanded={isMenuOpen}
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
