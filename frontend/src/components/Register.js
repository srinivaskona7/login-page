import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const USER_API_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:5001';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', passwordHint: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Processing...');
    try {
      await axios.post(`${USER_API_URL}/register`, formData);
      setMessage('OTP has been sent to your email. Please check your email and enter the OTP below.');
      setIsOtpSent(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Verifying OTP...');
    try {
      await axios.post(`${USER_API_URL}/verify-otp`, { email: formData.email, otp });
      setMessage('Registration was completed successfully!');
      setTimeout(() => history.push('/login'), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid OTP. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {!isOtpSent ? (
        <form onSubmit={handleRegister}>
          <input name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input name="passwordHint" placeholder="Password Hint" onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <p>An OTP was sent to {formData.email}.</p>
          <p><small>Note: In development mode, check the server console for the OTP.</small></p>
          <input value={otp} placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Complete Registration'}
          </button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
      }
    </div>
  );
}
export default Register;