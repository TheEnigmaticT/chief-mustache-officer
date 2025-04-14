
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Logo image with fallback
  const logoImageUrl = logoError ? "/lovable-uploads/image-1" : "/lovable-uploads/image-1";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Preload the logo image
  useEffect(() => {
    const img = new Image();
    img.src = logoImageUrl;
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => {
      console.error("Failed to load logo image");
      setLogoError(true);
    };
  }, [logoImageUrl]);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {logoLoaded ? (
              <img 
                src={logoImageUrl}
                alt="Chief Mustache Officer"
                className="h-8 rounded-full"
                loading="eager"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            )}
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
