import { useState, useEffect, useRef } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    previewUrl: '',
    date: '',
    sourceType: 'file',
    url: '',
  });

  // File size limit (in bytes)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Allowed file types
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/certificates');
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        toast.error('Failed to fetch certificates');
        console.error('Error fetching certificates:', error);
        setCertificates([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleOpenModal = (certificate = null) => {
    setSelectedCertificate(certificate);
    setFormData(certificate ? {
      title: certificate.title,
      description: certificate.description,
      file: null,
      previewUrl: certificate.previewUrl,
      date: certificate.date,
      sourceType: certificate.sourceType || 'file',
      url: certificate.url || '',
    } : {
      title: '',
      description: '',
      file: null,
      previewUrl: '',
      date: '',
      sourceType: 'file',
      url: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
    setFormData({
      title: '',
      description: '',
      file: null,
      previewUrl: '',
      date: '',
      sourceType: 'file',
      url: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragEvents = (e, isEnter) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEnter);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (!allowedFileTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, JPG, or PNG file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum size is 10MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      url: '',
      fileType: file.type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (formData.sourceType === 'file' && !formData.file && !selectedCertificate) {
        toast.error('Please select a file');
        return;
      }

      if (formData.sourceType === 'url' && !formData.url) {
        toast.error('Please enter a valid URL');
        return;
      }

      let response, data;
      const submitDate = formData.date || new Date().toISOString().split('T')[0];
      if (formData.sourceType === 'file') {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('date', submitDate);
        fd.append('sourceType', 'file');
        fd.append('fileType', formData.fileType || '');
        if (formData.file) fd.append('file', formData.file);
        response = await fetch('http://localhost:5000/api/certificates', {
          method: 'POST',
          body: fd,
        });
        data = await response.json();
      } else {
        response = await fetch('http://localhost:5000/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            date: submitDate,
            sourceType: 'url',
            url: formData.url,
            fileType: formData.fileType || '',
          }),
        });
        data = await response.json();
      }

      if (!response.ok) throw new Error(data.error || 'Failed to save certificate');
      setCertificates(prev => selectedCertificate
        ? prev.map(cert => cert.id === selectedCertificate.id ? data : cert)
        : [...prev, data]
      );
      toast.success(selectedCertificate ? 'Certificate updated successfully' : 'Certificate added successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to save certificate');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/certificates/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data.success) throw new Error('Failed to delete');
        setCertificates(prev => prev.filter(cert => cert.id !== id));
        toast.success('Certificate deleted successfully');
      } catch (error) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) {
      return (
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  const fileTypeLabels = {
    'application/pdf': 'PDF Document',
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPG Image',
    'image/png': 'PNG Image'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Certificates</h1>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Certificate
            </button>
          </div>

          {loading ? (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading certificates...</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map(certificate => (
                <div key={certificate.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{certificate.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{certificate.description}</p>
                    <p className="mt-2 text-sm text-gray-400">
                      Issued on: {new Date(certificate.date).toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      {certificate.fileType?.startsWith('image/') ? (
                        <img src={certificate.previewUrl} alt={certificate.title} className="w-full h-48 object-cover rounded-lg" />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                          <div className="text-center">
                            {getFileIcon(certificate.fileType)}
                            <p className="mt-2 text-sm text-gray-500">
                              {fileTypeLabels[certificate.fileType] || 'Document'}
                            </p>
                            {certificate.file && (
                              <a
                                href={URL.createObjectURL(certificate.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                              >
                                View PDF
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleOpenModal(certificate)}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(certificate.id)}
                        className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="px-4 py-5 sm:p-6 flex-1 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCertificate ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4 flex flex-col h-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Source Type</label>
                  <select
                    name="sourceType"
                    value={formData.sourceType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="file">File Upload</option>
                    <option value="url">URL</option>
                  </select>
                </div>

                {formData.sourceType === 'file' ? (
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                      isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleFile(e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG files up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Document URL</label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="Enter document URL"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {formData.previewUrl && formData.fileType?.startsWith('image/') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Preview</label>
                    <img src={formData.previewUrl} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="mt-5 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 pb-2 z-10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={uploading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {uploading ? 'Uploading...' : (selectedCertificate ? 'Update' : 'Add')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates; 