import React, { useState, useEffect } from 'react';

// This is temporary code to find the connection error.
function Login() {
  const [testMessage, setTestMessage] = useState('Attempting to connect to the backend at http://localhost:5002/courses ...');

  useEffect(() => {
    fetch('http://localhost:5002/courses')
      .then(response => {
        if (!response.ok) {
          // This will catch HTTP errors like 404 or 500
          throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setTestMessage('✅ SUCCESS: Successfully connected to the backend and received data!');
      })
      .catch(error => {
        // This will catch network failures (like CORS) or other errors
        console.error('THIS IS THE REAL ERROR:', error);
        setTestMessage(`❌ FAILED: Could not connect to backend. The final error is: ${error.message}`);
      });
  }, []); // The empty array ensures this runs only once.

  return (
    <div style={{ padding: '20px', fontSize: '1.2rem', textAlign: 'left', lineHeight: '1.6' }}>
      <h2>Backend Connection Test</h2>
      <p style={{ color: testMessage.startsWith('❌') ? 'red' : 'green', fontWeight: 'bold' }}>
        {testMessage}
      </p>
      <p>This message will tell us if the frontend can communicate with the backend services.</p>
    </div>
  );
}

export default Login;