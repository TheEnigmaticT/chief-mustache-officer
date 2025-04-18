import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import RobustImage from './RobustImage';

// Define logo paths
const logoPath = "/img/ChiefMustacheOfficer_Logo_Horizontal.png";
const logoFallbacks = [
  "/img/cmo.jpg",
  "/img/image-2.png",
  "/img/image-3.png"
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - updated to show full logo */}
          <Link to="/" className="flex items-center">
            <RobustImage 
              src={logoPath}
              fallbacks={logoFallbacks}
              alt="Chief Mustache Officer"
              className="h-12 w-auto object-contain"
              loading="eager"
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
              Content
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
