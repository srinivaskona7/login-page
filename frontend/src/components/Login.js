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
  const history = useHistory();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${COURSE_API_URL}/courses`);
        setBooks(response.data);
      } catch (error) {
        console.error("Could not fetch books", error);
      }
    };
    fetchBooks();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      const response = await axios.post(`${USER_API_URL}/login`, { email, password });
      history.push({
        pathname: '/welcome',
        state: { user: response.data }
      });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
      <div className="book-display">
        <h3>Featured Books</h3>
        {books.map(book => (
          <img key={book._id} src={book.imageUrl} alt={book.title} className="book-image" />
        ))}
      </div>
    </div>
  );
}
export default Login;