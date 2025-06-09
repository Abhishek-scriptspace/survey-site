// import Navbar from '../components/Navbar';
import { AcademicCapIcon, GlobeAltIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/solid';

const pillars = [
  {
    icon: <AcademicCapIcon className="w-8 h-8 text-[#7091E6]" />,
    title: "Education for All",
    description: "We strive to provide quality education and learning opportunities to every individual, regardless of background.",
    image: "https://www.istockphoto.com/photo/group-of-indian-village-students-in-school-uniform-sitting-in-classroom-doing-gm2075583750-564868460?utm_source=pixabay&utm_medium=affiliate&utm_campaign=sponsored_photo&utm_content=srp_topbanner_media&utm_term=educational://images.unsplash.com/photo-1600052402316-07c03f3b7b4a?auto=format&fit=crop&w=800&q=80", // School children studying
  },
  {
    icon: <GlobeAltIcon className="w-8 h-8 text-[#7091E6]" />,
    title: "Sustainable Communities",
    description: "We foster self-sustaining communities through environmental conservation and resource management.",
    image: "https://images.unsplash.com/photo-1584270354949-1fe529b5bfa4?auto=format&fit=crop&w=800&q=80", // Solar energy village
  },
  {
    icon: <UsersIcon className="w-8 h-8 text-[#7091E6]" />,
    title: "Inclusivity & Integrity",
    description: "We value diversity, honesty, and equal opportunities for all, ensuring transparency in all our operations.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", // Group of diverse people
  },
  {
    icon: <SparklesIcon className="w-8 h-8 text-[#7091E6]" />,
    title: "Innovation & The Road Ahead",
    description: "We embrace creative solutions and adapt our strategies to meet the changing needs of the communities we serve.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", // Innovation
  },
];

const Vision = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#3D52A0] via-[#7091E6] to-[#8697C4] h-72 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Vision background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow mb-4">
            Our Vision
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-2xl text-[#EDE8F5] font-medium drop-shadow">
            We envision a world where every individual has access to quality education, healthcare, and opportunities for sustainable development.
          </p>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#3D52A0] mb-4">Our Pillars</h2>
          <p className="max-w-xl mx-auto text-[#8697C4]">
            The core values and goals that guide our journey toward a brighter, more inclusive future.
          </p>
        </div>

        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center gap-8`}
          >
            {/* Content */}
            <div className="md:w-1/2 text-center md:text-left space-y-3">
              <div className="inline-block mb-2">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-[#3D52A0]">{pillar.title}</h3>
              <p className="text-[#5A6A9A] leading-relaxed">{pillar.description}</p>
            </div>

            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={pillar.image}
                alt={pillar.title}
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vision;
