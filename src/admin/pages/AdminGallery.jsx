import { useState, useEffect, useRef } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';

const AdminGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    description: '',
    file: null,
    previewUrl: '',
    sourceType: 'file',
    url: '',
  });

  // File size limits (in bytes)
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-matroska'];

  // URL validation patterns
  const imageUrlPattern = /\.(jpg|jpeg|png|gif)(\?.*)?$/i;
  const videoUrlPattern = /\.(mp4|avi|mov|wmv|mkv)(\?.*)?$/i;
  const youtubePattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const vimeoPattern = /vimeo\.com\/(\d+)/i;

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/gallery');
        const data = await res.json();
        setMedia(data);
      } catch (error) {
        toast.error('Failed to fetch media');
        console.error('Error fetching media:', error);
        setMedia([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleOpenModal = (mediaItem = null) => {
    setSelectedMedia(mediaItem);
    setFormData(mediaItem ? {
      type: mediaItem.type,
      title: mediaItem.title,
      description: mediaItem.description,
      file: null,
      previewUrl: mediaItem.previewUrl,
      sourceType: mediaItem.sourceType || 'file',
      url: mediaItem.url || '',
    } : {
      type: 'image',
      title: '',
      description: '',
      file: null,
      previewUrl: '',
      sourceType: 'file',
      url: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setFormData({
      type: 'image',
      title: '',
      description: '',
      file: null,
      previewUrl: '',
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
    const allowedTypes = formData.type === 'image' ? allowedImageTypes : allowedVideoTypes;
    const maxSize = formData.type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please upload a ${formData.type === 'image' ? 'JPEG, JPG, PNG, or GIF' : 'MP4, AVI, MOV, WMV, or MKV'} file.`);
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size too large. Maximum size is ${formData.type === 'image' ? '5MB' : '50MB'}`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
      previewUrl: URL.createObjectURL(file),
      url: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (formData.sourceType === 'file' && !formData.file && !selectedMedia) {
        toast.error('Please select a file');
        return;
      }

      if (formData.sourceType === 'url' && !formData.url) {
        toast.error('Please enter a valid URL');
        return;
      }

      let response, data;
      const submitDate = new Date().toISOString().split('T')[0];
      if (formData.sourceType === 'file') {
        const fd = new FormData();
        fd.append('type', formData.type);
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('uploadDate', submitDate);
        fd.append('sourceType', 'file');
        if (formData.file) fd.append('file', formData.file);
        response = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          body: fd,
        });
        data = await response.json();
      } else {
        response = await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: formData.type,
            title: formData.title,
            description: formData.description,
            uploadDate: submitDate,
            sourceType: 'url',
            url: formData.url,
          }),
        });
        data = await response.json();
      }

      if (!response.ok) throw new Error(data.error || 'Failed to save media');
      setMedia(prev => selectedMedia
        ? prev.map(item => item.id === selectedMedia.id ? data : item)
        : [...prev, data]
      );
      toast.success(selectedMedia ? 'Media updated successfully' : 'Media added successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to save media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data.success) throw new Error('Failed to delete');
        setMedia(prev => prev.filter(item => item.id !== id));
        toast.success('Media deleted successfully');
      } catch (error) {
        toast.error('Failed to delete media');
      }
    }
  };

  const filteredMedia = activeTab === 'all' ? media : media.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Media
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex justify-center space-x-4">
            {['all', 'image', 'video'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading gallery...</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map(item => (
                <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Uploaded on: {new Date(item.uploadDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      {item.type === 'image' ? (
                        <img src={item.previewUrl} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                      ) : (
                        <div className="relative pb-[56.25%] h-0">
                          <iframe
                            src={item.previewUrl}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedMedia ? 'Edit Media' : 'Add New Media'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Media Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
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
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleFile(e.target.files[0])}
                            accept={formData.type === 'image' ? '.jpg,.jpeg,.png,.gif' : '.mp4,.avi,.mov,.wmv,.mkv'}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.type === 'image' ? 'PNG, JPG, GIF up to 5MB' : 'MP4, AVI, MOV, WMV, MKV up to 50MB'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {formData.type === 'image' ? 'Image URL' : 'Video URL'}
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder={`Enter ${formData.type === 'image' ? 'image' : 'video'} URL`}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="mt-5 flex justify-end space-x-3">
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
                    {uploading ? 'Uploading...' : (selectedMedia ? 'Update' : 'Add')}
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

export default AdminGallery; 