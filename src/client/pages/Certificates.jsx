import { useState, useEffect } from 'react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileTypeLabels = {
    'application/pdf': 'PDF Document',
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPG Image',
    'image/png': 'PNG Image'
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) {
      return (
        <svg className="h-12 w-12 text-[#7091E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="h-12 w-12 text-[#3D52A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/certificates');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCertificates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setError('Failed to load certificates. Please try again later.');
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="pt-24 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#3D52A0] sm:text-5xl lg:text-7xl drop-shadow-md">
          Our Certificates
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#8697C4] leading-relaxed">
          Explore our official documents and certifications that demonstrate our credibility and the quality of our work.
        </p>
        <div className="mt-8 w-24 h-1 bg-[#7091E6] mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7091E6] mx-auto"></div>
          <p className="mt-4 text-[#8697C4]">Loading certificates...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center">
          <p className="text-[#8697C4]">No certificates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#ADBBDA]">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3D52A0]">{certificate.title}</h3>
                <p className="mt-2 text-sm text-[#8697C4]">{certificate.description}</p>
                <p className="mt-2 text-sm text-[#8697C4]">
                  Issued on: {new Date(certificate.date).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  {certificate.file_type?.startsWith('image/') ? (
                    <img
                      src={certificate.fileUrl}
                      alt={certificate.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-[#EDE8F5] rounded-lg">
                      <div className="text-center">
                        {getFileIcon(certificate.file_type)}
                        <p className="mt-2 text-sm text-[#8697C4]">
                          {fileTypeLabels[certificate.file_type] || 'Document'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.open(certificate.fileUrl, '_blank')}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7091E6] hover:bg-[#8697C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7091E6] transition-colors duration-200"
                  >
                    {certificate.file_type?.startsWith('image/') ? 'View Image' : 'View PDF'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
