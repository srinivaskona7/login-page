import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const USER_API_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:5001';
const COURSE_API_URL = process.env.REACT_APP_COURSE_API_URL || 'http://localhost:5002';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${COURSE_API_URL}/courses`);
        setBooks(response.data);
      } catch (error) {
        console.error("Could not fetch books:", error);
        setBooks([]); // Set empty array on error
      }
    };
    fetchBooks();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Logging in...');
    try {
      const response = await axios.post(`${USER_API_URL}/login`, { email, password });
      setMessage('Login successful! Redirecting...');
      history.push({
        pathname: '/welcome',
        state: { user: response.data }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        }
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
      {books.length > 0 && (
        <div className="book-display">
          <h3>Featured Books</h3>
          <div className="books-grid">
            {books.map(book => (
              <div key={book._id} className="book-item">
                <img src={book.imageUrl} alt={book.title} className="book-image" />
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;