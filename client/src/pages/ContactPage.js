import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send the form data to the backend or email service
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Contact Us</h1>
      <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Business Contact Details</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-primary-500 w-5 h-5" />
            <span className="text-gray-700">ntombifuthimashinini771@gmail.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaPhone className="text-primary-500 w-5 h-5" />
            <span className="text-gray-700">+27 81 896 8561</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-8">
        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
        {submitted ? (
          <div className="text-success-600 font-semibold flex items-center space-x-2">
            <FaPaperPlane />
            <span>Thank you for reaching out! We'll get back to you soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="label">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="label">Message</label>
              <textarea
                id="message"
                name="message"
                className="input"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <FaPaperPlane />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage; 