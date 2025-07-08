import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Welcome() {
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You must be logged in to see this page. <Link to="/login">Go to Login</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {user.firstName} {user.lastName}!</h2>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default Welcome;