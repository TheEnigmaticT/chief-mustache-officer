
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Chief Mustache Officer</h3>
            <p className="text-gray-300 mb-4">
              Trevor Longino - AI-powered CMO with 20+ years of go-to-market experience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/trevorlongino"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-mustache transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://twitter.com/trevorlongino"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-mustache transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://youtube.com/@launchtoday"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-mustache transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Site Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-mustache transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/cv" className="text-gray-300 hover:text-mustache transition-colors">About Me</Link>
              </li>
              <li>
                <Link to="/publications" className="text-gray-300 hover:text-mustache transition-colors">Content</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-mustache transition-colors">Projects</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-mustache" />
                <a href="mailto:trevor.longino@gmail.com" className="text-gray-300 hover:text-mustache transition-colors">
                  trevor.longino@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-mustache" />
                <a href="tel:+15146494103" className="text-gray-300 hover:text-mustache transition-colors">
                  +1 514-649-4103
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-lighter mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Trevor Longino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
