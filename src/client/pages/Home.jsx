import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderImages = [
    "https://images.pexels.com/photos/8493777/pexels-photo-8493777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/8633375/pexels-photo-8633375.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/9823011/pexels-photo-9823011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/28593792/pexels-photo-28593792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "https://images.pexels.com/photos/6472427/pexels-photo-6472427.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div id="hero-section" className="relative bg-[#3D52A0] min-h-screen flex items-center pt-0">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover transition-opacity duration-1000"
            src={sliderImages[currentImageIndex]}
            alt="Children in slum community"
          />
          <div className="absolute inset-0 bg-[#3D52A0]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 mt-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#EDE8F5] sm:text-5xl lg:text-6xl">
            Empowering Communities,<br />Transforming Lives
          </h1>
          <p className="mt-6 text-xl text-[#ADBBDA] max-w-3xl">
            Every child deserves a chance to dream. Join us in providing education, nutrition, and hope to underprivileged communities.
          </p>
          <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/donate"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md text-white bg-[#7091E6] hover:bg-[#8697C4] transition duration-150"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* Impact Stats with Glassmorphism */}
      <div className="relative z-10 py-20 bg-transparent">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[
        {
          label: "Children Supported",
          value: "5000+",
          gradient: "from-pink-500 via-red-400 to-orange-300",
        },
        {
          label: "Communities Served",
          value: "20+",
          gradient: "from-green-400 via-teal-300 to-cyan-200",
        },
        {
          label: "Meals Distributed",
          value: "100K",
          gradient: "from-yellow-400 via-orange-400 to-red-300",
        },
        {
          label: "Active Volunteers",
          value: "1000+",
          gradient: "from-blue-500 via-indigo-400 to-purple-400",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className={`rounded-2xl p-6 text-center text-white shadow-xl backdrop-blur-xl border border-white/20 bg-gradient-to-br ${stat.gradient} bg-opacity-30 transition-transform duration-300 hover:scale-105`}
        >
          <div className="text-4xl font-bold drop-shadow mb-2">{stat.value}</div>
          <div className="text-md font-medium drop-shadow">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>



      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#3D52A0] mb-10 text-center">Featured Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div className="group relative bg-[#7DB6F5] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-110">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=400&h=180&q=80" alt="Mission" className="w-full h-28 object-cover" />
              <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 400 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 24 Q200 48 400 24 V48 H0 V24 Z" fill="#5A9BEF" />
              </svg>
            </div>
            <div className="p-5 pt-3">
              <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
              <p className="text-white text-xs mb-4">Learn about our core mission and how we're working to make a difference in our community.</p>
              <Link to="/mission" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block px-4 py-2 bg-white text-[#3D52A0] rounded-lg font-semibold shadow hover:bg-[#EDE8F5] mt-2">Learn more</Link>
            </div>
          </div>
          {/* Vision Card */}
          <div className="group relative bg-[#F9D77E] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-110">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=180&q=80" alt="Vision" className="w-full h-28 object-cover" />
              <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 400 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 24 Q200 48 400 24 V48 H0 V24 Z" fill="#F5C542" />
              </svg>
            </div>
            <div className="p-5 pt-3">
              <h3 className="text-lg font-bold text-[#7C4700] mb-2">Our Vision</h3>
              <p className="text-[#7C4700] text-xs mb-4">Discover our vision for the future and how we plan to achieve our goals.</p>
              <Link to="/vision" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block px-4 py-2 bg-white text-[#B45309] rounded-lg font-semibold shadow hover:bg-[#F9EBC8] mt-2">Learn more</Link>
            </div>
          </div>
          {/* Gallery Card */}
          <div className="group relative bg-[#7DEFC1] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-110">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=180&q=80" alt="Gallery" className="w-full h-28 object-cover" />
              <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 400 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 24 Q200 48 400 24 V48 H0 V24 Z" fill="#10B981" />
              </svg>
            </div>
            <div className="p-5 pt-3">
              <h3 className="text-lg font-bold text-[#047857] mb-2">Our Gallery</h3>
              <p className="text-[#047857] text-xs mb-4">View our latest activities, events, and the impact we're making in the community.</p>
              <Link to="/gallery" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block px-4 py-2 bg-white text-[#047857] rounded-lg font-semibold shadow hover:bg-[#CFFCEF] mt-2">View gallery</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
