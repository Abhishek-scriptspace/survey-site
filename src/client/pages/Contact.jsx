import { useState } from 'react';
// import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the form data to your backend
      console.log(data);
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#3D52A0] to-[#7091E6] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Let's Connect
            </h1>
            <p className="text-xl text-[#EDE8F5]">
              Your voice matters to us. Reach out and let's make a difference together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3D52A0] mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#EDE8F5]">
                      <MapPinIcon className="h-6 w-6 text-[#7091E6]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-[#3D52A0]">Address</h3>
                    <p className="mt-2 text-[#8697C4]">
                      123 NGO Street<br />
                      City, State 12345<br />
                      Country
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#EDE8F5]">
                      <PhoneIcon className="h-6 w-6 text-[#7091E6]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-[#3D52A0]">Phone</h3>
                    <p className="mt-2 text-[#8697C4]">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#EDE8F5]">
                      <EnvelopeIcon className="h-6 w-6 text-[#7091E6]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-[#3D52A0]">Email</h3>
                    <p className="mt-2 text-[#8697C4]">
                      info@ngoname.org
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#EDE8F5]">
                      <ClockIcon className="h-6 w-6 text-[#7091E6]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-[#3D52A0]">Office Hours</h3>
                    <p className="mt-2 text-[#8697C4]">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3D52A0] mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#3D52A0]">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="mt-1 block w-full px-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#3D52A0]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#3D52A0]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7091E6] text-white py-3 px-4 rounded-md hover:bg-[#8697C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7091E6] transition-colors duration-200"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 