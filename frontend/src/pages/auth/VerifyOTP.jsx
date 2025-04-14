import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth(); // Import resendOTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  
  // Get email from location state or use a default
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to register
      navigate('/register');
    }
  }, [location, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle key down event for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;
      const inputToFocus = document.getElementById(`otp-${focusIndex}`);
      
      if (inputToFocus) {
        inputToFocus.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await verifyOTP(email, otpValue);
      if (result) { // Assuming verifyOTP returns user data on success
        toast.success('Email verified successfully!');
        navigate('/login');
      } else {
        // This case might not be reached if verifyOTP throws an error on failure
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (timer === 0) {
      setIsResending(true);
      try {
        await resendOTP(email);
        toast.success('OTP has been resent to your email');
        setTimer(60); // Reset timer after successful resend
      } catch (error) {
        toast.error(error.message || 'Failed to resend OTP.');
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <i className="bi bi-shield-lock text-primary-600 text-5xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to<br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp-0" className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Verify
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timer > 0 || isResending}
                className={`font-medium ${
                  timer > 0 || isResending
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary-600 hover:text-primary-500'
                }`}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <i className="bi bi-arrow-repeat animate-spin mr-1"></i>
                    Resending...
                  </span>
                ) : timer > 0 ? (
                  `Resend in ${timer}s`
                ) : (
                  'Resend code'
                )}
              </button>
            </p>
          </div>
        </div>
        
        <p className="mt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Innovative Skills. All rights reserved.
          <br />
          <span className="mt-1 block">Designed by Imran Nur</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
