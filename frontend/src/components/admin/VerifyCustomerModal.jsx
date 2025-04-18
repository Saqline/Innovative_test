import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { verifyCustomerOTP, resendOTP } from '../../services/api/users';

const VerifyCustomerModal = ({ isOpen, onClose, customerEmail, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement.nextElementSibling.querySelector('input');
      nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousElementSibling.querySelector('input');
      prevInput.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(customerEmail);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyCustomerOTP(customerEmail, otpValue);
      toast.success('Customer verified successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verify Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Enter verification code for:</p>
          <p className="font-medium">{customerEmail}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-12 text-center text-xl border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Verifying...' : 'Verify Customer'}
            </button>
            
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full py-2 text-blue-600 hover:text-blue-700 disabled:text-blue-300"
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCustomerModal;