import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset transparency state when route changes
    setIsTransparent(false);

    // Only set up observer for home page
    if (location.pathname === '/') {
      const hero = document.getElementById('hero-section');
      if (!hero) return;

      // Set initial transparency based on hero section visibility
      const isHeroVisible = hero.getBoundingClientRect().top < window.innerHeight;
      setIsTransparent(isHeroVisible);

      const observer = new window.IntersectionObserver(
        ([entry]) => {
          setIsTransparent(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Mission', href: '/mission' },
    { name: 'Vision', href: '/vision' },
    { name: 'Certificates', href: '/certificates' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Donate', href: '/donate', special: true },
    { name: 'Admin', href: '/admin/login', special: true }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className={`text-2xl font-bold transition duration-150 ${isTransparent ? 'text-white' : 'text-gray-800 hover:text-primary-600'} font-extrabold`}>Script Space</Link>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-all duration-150 font-bold ${
                  item.special
                    ? `${isTransparent ? 'bg-transparent text-white border border-white' : 'bg-primary-600 text-white hover:bg-primary-700'} px-6 py-2.5 text-sm rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5`
                    : `${isTransparent ? 'text-white' : 'text-gray-800 hover:text-primary-600'} px-3 py-2 text-sm font-bold relative group`
                }`}
              >
                {item.name}
                {!item.special && (
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${isTransparent ? 'bg-white' : 'bg-primary-600'} group-hover:w-full transition-all duration-150`}></span>
                )}
              </Link>
            ))}
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`sm:hidden ${isTransparent ? 'bg-black/80 border-t border-white/10' : 'bg-white border-t border-gray-100'}`}>
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block rounded-lg ${
                  item.special
                    ? `${isTransparent ? 'text-white border border-white bg-transparent hover:bg-white/10' : 'text-white bg-primary-600 hover:bg-primary-700'} px-4 py-3 mt-2 text-center font-semibold shadow-md` 
                    : `${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'} px-4 py-2 text-base font-bold` 
                } transition duration-150`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 