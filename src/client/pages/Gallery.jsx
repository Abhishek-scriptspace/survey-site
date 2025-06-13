import { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/gallery');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setMedia(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching media:', error);
        setError('Failed to load gallery items. Please try again later.');
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filteredMedia = activeTab === 'all'
    ? media
    : media.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-white pt-16">
      {/* <Navbar /> */}

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#3D52A0] sm:text-5xl sm:tracking-tight lg:text-6xl">
            Gallery
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-[#8697C4]">
            Explore our photos and videos showcasing our work and impact.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex justify-center space-x-4">
          {['all', 'image', 'video'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab ? 'bg-[#7091E6] text-white' : 'bg-[#EDE8F5] text-[#3D52A0] hover:bg-[#ADBBDA]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7091E6] mx-auto"></div>
            <p className="mt-4 text-[#8697C4]">Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="mt-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-[#8697C4]">No gallery items found.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer border border-[#ADBBDA] hover:shadow-xl transition-shadow duration-200"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#3D52A0]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#8697C4]">{item.description}</p>
                  <p className="mt-1 text-xs text-[#8697C4]">
                    Uploaded on: {new Date(item.upload_date).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    {item.type === 'image' ? (
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (item.type === 'video' && (
                      <div className="relative pb-[56.25%] h-0">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={item.fileUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-[#3D52A0] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-semibold text-[#3D52A0]">{selectedMedia.title}</h3>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="text-[#8697C4] hover:text-[#3D52A0]"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-[#8697C4]">{selectedMedia.description}</p>
                <div className="mt-4">
                  {selectedMedia.type === 'image' ? (
                    <img
                      src={selectedMedia.fileUrl}
                      alt={selectedMedia.title}
                      className="w-full rounded-lg"
                    />
                  ) : (selectedMedia.type === 'video' && (
                    <div className="relative pb-[56.25%] h-0">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={selectedMedia.fileUrl}
                        title={selectedMedia.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
