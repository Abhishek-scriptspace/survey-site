import { useState } from 'react';
// import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { HeartIcon, GiftIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const quotes = [
  {
    text: "Every child deserves a chance to dream big",
    author: "Education Changes Lives"
  },
  {
    text: "Small acts of kindness can transform a child's future",
    author: "Hope Foundation"
  },
  {
    text: "When we give cheerfully, we change lives forever",
    author: "Giving Hearts"
  }
];

const impactMessages = {
  monthly: [
    "$15 provides educational supplies for a month",
    "$30 ensures nutritious meals for a child",
    "$50 supports healthcare needs",
    "$75 enables skill development programs",
    "$100 sponsors a child's complete monthly needs"
  ],
  once: [
    "$50 provides emergency relief supplies",
    "$100 funds medical care for a family",
    "$250 supports community development",
    "$500 helps build educational facilities",
    "$1000 transforms an entire community"
  ]
};

const Donate = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [donationType, setDonationType] = useState('monthly');
  const [currentQuote, setCurrentQuote] = useState(0);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const monthlyAmounts = [15, 30, 50, 75, 100];
  const oneTimeAmounts = [50, 100, 250, 500, 1000];

  const currentAmounts = donationType === 'monthly' ? monthlyAmounts : oneTimeAmounts;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const amount = selectedAmount || data.customAmount;
    
    // Simulate donation processing
    setTimeout(() => {
      setIsSubmitting(false);
      setDonationSuccess(true);
      toast.success(`Thank you for your donation of $${amount}!`);
      reset();
      setSelectedAmount(null);
    }, 1500);
  };

  // Image URLs that show hope and potential, not despair
  const imageUrl = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

  if (donationSuccess) {
    return (
      <div className="min-h-screen bg-[#EDE8F5] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#EDE8F5] mb-4">
            <HeartIcon className="h-8 w-8 text-[#7091E6]" />
          </div>
          <h2 className="text-2xl font-bold text-[#3D52A0] mb-2">Thank You!</h2>
          <p className="text-[#8697C4] mb-6">Your donation will make a real difference in someone's life.</p>
          <button
            onClick={() => setDonationSuccess(false)}
            className="w-full py-3 px-4 bg-[#7091E6] text-white rounded-md hover:bg-[#8697C4] transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-white">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Image and Text */}
            <div className="relative bg-white">
              <div className="h-64 lg:h-96">
                <img
                  src={imageUrl}
                  alt="Children smiling with hope"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D52A0]/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg italic font-light mb-2">"{quotes[currentQuote].text}"</p>
                    <p className="text-sm">— {quotes[currentQuote].author}</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[#3D52A0] mb-3">
                  Transform a life for as little as $15 a month
                </h2>
                <p className="text-[#8697C4] text-sm leading-relaxed mb-4">
                  Your generosity can break the cycle of poverty and create lasting change. Every donation, no matter the size, helps us provide:
                </p>
                <ul className="space-y-2 text-sm text-[#8697C4]">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#7091E6] rounded-full mr-2"></span>
                    Quality education and school supplies
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#7091E6] rounded-full mr-2"></span>
                    Nutritious meals and clean water
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#7091E6] rounded-full mr-2"></span>
                    Healthcare and medical support
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#7091E6] rounded-full mr-2"></span>
                    Safe spaces for learning and growth
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side - Donation Form */}
            <div className="p-8 bg-white border-l border-[#ADBBDA]">
              {/* Donation Type Toggle */}
              <div className="grid grid-cols-2 gap-1 bg-[#EDE8F5] p-1 rounded-md mb-8">
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`py-2.5 px-4 text-sm font-medium text-center rounded ${
                    donationType === 'monthly'
                      ? 'bg-white text-[#3D52A0] shadow-sm'
                      : 'text-[#8697C4] hover:text-[#3D52A0]'
                  }`}
                >
                  GIVE MONTHLY
                </button>
                <button
                  onClick={() => setDonationType('once')}
                  className={`py-2.5 px-4 text-sm font-medium text-center rounded ${
                    donationType === 'once'
                      ? 'bg-white text-[#3D52A0] shadow-sm'
                      : 'text-[#8697C4] hover:text-[#3D52A0]'
                  }`}
                >
                  GIVE ONCE
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3D52A0] mb-3">
                    CHOOSE A {donationType.toUpperCase()} AMOUNT
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {currentAmounts.map((amount, index) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedAmount(amount)}
                        className={`py-2.5 px-4 rounded text-sm font-medium transition-all duration-200 ${
                          selectedAmount === amount
                            ? 'bg-[#7091E6] text-white border border-[#7091E6]'
                            : 'bg-white text-[#8697C4] border border-[#ADBBDA] hover:border-[#7091E6] hover:text-[#7091E6]'
                        }`}
                      >
                        ${amount}
                        {selectedAmount === amount && (
                          <p className="text-xs mt-1 text-white">
                            {donationType === 'monthly' ? impactMessages.monthly[index] : impactMessages.once[index]}
                          </p>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAmount(null)}
                      className={`py-2.5 px-4 rounded text-sm font-medium transition-all duration-200 
                        bg-white text-[#8697C4] border border-[#ADBBDA] hover:border-[#7091E6] hover:text-[#7091E6]`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                {!selectedAmount && (
                  <div>
                    <label htmlFor="customAmount" className="sr-only">
                      Enter custom amount
                    </label>
                    <div className="relative rounded-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-[#8697C4]">$</span>
                      </div>
                      <input
                        type="number"
                        id="customAmount"
                        {...register('customAmount', {
                          min: { value: 1, message: 'Amount must be at least $1' },
                        })}
                        className="block w-full pl-7 pr-4 py-2.5 text-sm border border-[#ADBBDA] rounded focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                        placeholder="Enter amount"
                      />
                    </div>
                    {errors.customAmount && (
                      <p className="mt-2 text-sm text-red-600">{errors.customAmount.message}</p>
                    )}
                  </div>
                )}

                {/* Selected Amount Display */}
                <div className="bg-[#EDE8F5] p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8697C4]">Your {donationType} gift:</span>
                    <span className="text-xl font-bold text-[#3D52A0]">
                      ${selectedAmount || watch('customAmount') || '0.00'}
                    </span>
                  </div>
                  {selectedAmount && (
                    <p className="text-xs text-[#8697C4] mt-2">
                      {donationType === 'monthly' 
                        ? impactMessages.monthly[currentAmounts.indexOf(selectedAmount)]
                        : impactMessages.once[currentAmounts.indexOf(selectedAmount)]}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!selectedAmount && !watch('customAmount'))}
                  className="w-full py-3 px-6 text-sm font-medium text-white bg-[#7091E6] rounded hover:bg-[#8697C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7091E6] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Donate Now'}
                </button>

                <p className="text-xs text-[#8697C4] text-center">
                  Your donation is secure and encrypted. By continuing, you agree to our terms of service and privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate; 