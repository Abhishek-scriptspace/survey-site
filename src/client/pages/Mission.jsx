// import Navbar from '../components/Navbar';
import { CheckCircleIcon, AcademicCapIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

const timeline = [
  {
    title: "Empowering Communities",
    icon: <GlobeAltIcon className="w-6 h-6 text-white" />,
    description:
      "We empower communities through sustainable development, education, and social welfare projects. Our mission is to create lasting positive change by addressing the root causes of social issues.",
  },
  {
    title: "Education & Training",
    icon: <AcademicCapIcon className="w-6 h-6 text-white" />,
    description:
      "We provide quality education and vocational training to underprivileged communities, opening doors to new opportunities and brighter futures.",
  },
  {
    title: "Sustainable Solutions",
    icon: <CheckCircleIcon className="w-6 h-6 text-white" />,
    description:
      "We believe in sustainable, community-driven solutions that respect local knowledge and traditions, ensuring long-term impact and empowerment.",
  },
];

const Mission = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-white pt-24 px-4">
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#3D52A0] sm:text-5xl mb-3">Our Mission</h1>
          <p className="max-w-2xl mx-auto text-base text-[#8697C4]">
            We are committed to making a positive impact in our community.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7091E6] to-[#ADBBDA] z-0 transform -translate-x-1/2"></div>

          <div className="space-y-8 relative z-10 max-w-3xl mx-auto grid gap-y-8">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-9 items-center w-full"
              >
                {/* Left Content */}
                <div className={`col-span-4 flex justify-end ${idx % 2 === 0 ? '' : 'invisible'}`}> {/* Show for even idx */}
                  {idx % 2 === 0 && (
                    <div className="max-w-xs text-right text-[#3D52A0]">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-[#5A6A9A] leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
                {/* Timeline Icon */}
                <div className="col-span-1 flex flex-col items-center z-10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7091E6] to-[#ADBBDA] flex items-center justify-center border-2 border-white">
                    {item.icon}
                  </div>
                  {idx !== timeline.length - 1 && (
                    <div className="flex-1 w-1 bg-gradient-to-b from-[#7091E6] to-[#ADBBDA] my-1"></div>
                  )}
                </div>
                {/* Right Content */}
                <div className={`col-span-4 flex justify-start ${idx % 2 !== 0 ? '' : 'invisible'}`}> {/* Show for odd idx */}
                  {idx % 2 !== 0 && (
                    <div className="max-w-xs text-left text-[#3D52A0]">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-[#5A6A9A] leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
