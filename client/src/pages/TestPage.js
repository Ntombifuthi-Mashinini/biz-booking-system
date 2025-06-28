import React, { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const TestPage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testHealthEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://biz-booking-system-3.onrender.com/api/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthEndpoint();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            API Connection Test
          </h1>
          
          <div className="space-y-6">
            {/* Health Check */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Backend Health Check
              </h2>
              
              {loading && (
                <div className="text-blue-600">Testing connection...</div>
              )}
              
              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded">
                  Error: {error}
                </div>
              )}
              
              {healthStatus && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Backend is running!
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Status:</strong> {healthStatus.status}</p>
                    <p><strong>Environment:</strong> {healthStatus.environment}</p>
                    <p><strong>Version:</strong> {healthStatus.version}</p>
                    <p><strong>Timestamp:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={testHealthEndpoint}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Again'}
              </button>
            </div>

            {/* Connection Info */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Connection Information
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Frontend URL:</strong> https://business-webs4.netlify.app</p>
                <p><strong>Backend URL:</strong> https://biz-booking-system-3.onrender.com</p>
                <p><strong>API Base URL:</strong> https://biz-booking-system-3.onrender.com/api</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Next Steps
              </h2>
              <div className="space-y-2 text-sm text-blue-700">
                <p>1. ✅ Backend is deployed and running</p>
                <p>2. ✅ Frontend is connected to backend</p>
                <p>3. 🔄 Set up environment variables in Render</p>
                <p>4. 🔄 Test user registration and login</p>
                <p>5. 🔄 Create your first service</p>
                <p>6. 🔄 Test booking functionality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 