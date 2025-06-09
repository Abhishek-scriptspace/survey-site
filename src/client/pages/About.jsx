import { useState } from 'react';
import { UserGroupIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/solid';

const sections = [
  {
    id: 'story',
    title: 'Our Story',
    icon: AcademicCapIcon,
    image: 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    content:
      'Founded in 2015, we began with a single mission: to uplift underprivileged communities through education, health, and nourishment. What started in a small room has grown into a nationwide initiative. We believe every child deserves a chance to succeed, and that belief fuels every project we launch.',
  },
  {
    id: 'team',
    title: 'Our Team',
    icon: UserGroupIcon,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    content:
      'Our team is a passionate blend of educators, social workers, healthcare professionals, and volunteers. Every member plays a key role in designing and implementing our impactful programs. Together, we form a resilient force for good, constantly learning and evolving with the needs of our communities.',
  },
  {
    id: 'achievements',
    title: 'Our Achievements',
    icon: StarIcon,
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    content:
      'To date, we have supported over 10,000 children, distributed 500,000+ meals, and launched more than 30 successful community projects. Our volunteer network has grown to 800+ individuals, all united in making a difference at the grassroots level.',
  },
];

const About = () => {
  const [activeSection, setActiveSection] = useState('story');

  const toggleSection = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#3D52A0] sm:text-5xl lg:text-6xl mb-4">
          About Us
        </h1>
        <p className="max-w-xl mx-auto text-xl text-[#8697C4]">
          Learn more about our mission, team, and milestones.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 flex-wrap mb-12">
        {sections.map(({ id, title, icon: Icon }) => (
          <button
            key={id}
            onClick={() => toggleSection(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border border-[#ADBBDA] font-semibold text-[#3D52A0] transition shadow-sm ${
              activeSection === id ? 'bg-[#7091E6] text-white' : 'bg-white hover:bg-[#EDE8F5]'
            }`}
          >
            <Icon className="w-6 h-6" />
            {title}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {sections.map(
        ({ id, title, content, image }) =>
          activeSection === id && (
            <div
              key={id}
              className="max-w-4xl mx-auto mb-16 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500"
            >
              <img src={image} alt={title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#3D52A0] mb-4">{title}</h2>
                <p className="text-[#5A6A9A] text-lg">{content}</p>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default About;

