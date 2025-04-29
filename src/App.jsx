import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import DynamicForm from './components/DynamicForm';

function App() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (userData) => {
    try {
      setError(null);
      const response = await fetch('https://dynamic-form-generator-9rl7.onrender.com/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      setUser(userData);

      // Fetch form data
      const formResponse = await fetch(`https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${userData.rollNumber}`);
      if (!formResponse.ok) {
        const errorData = await formResponse.json();
        throw new Error(errorData.message || 'Failed to fetch form');
      }

      const formJson = await formResponse.json();
      setFormData(formJson.form);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleRegistration = async (userData) => {
    try {
      setError(null);
      const response = await fetch('https://dynamic-form-generator-9rl7.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // After successful registration, switch to login view
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred during registration. Please try again.');
    }
  };

  const toggleRegistration = () => {
    setError(null);
    setIsRegistering(!isRegistering);
  };

  const handleFormSubmitComplete = () => {
    setUser(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {!user ? (
            isRegistering ? (
              <RegistrationForm 
                onSubmit={handleRegistration} 
                onLoginClick={toggleRegistration}
              />
            ) : (
              <LoginForm 
                onSubmit={handleLogin}
                onRegisterClick={toggleRegistration}
              />
            )
          ) : (
            <DynamicForm formData={formData} onSubmitComplete={handleFormSubmitComplete} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;