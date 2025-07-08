import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Welcome from './components/Welcome';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Login Page Application</h1>
        </header>
        <main>
          <ErrorBoundary> {/* Wrap your components */}
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/welcome" component={Welcome} />
              <Redirect from="/" to="/login" />
            </Switch>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;