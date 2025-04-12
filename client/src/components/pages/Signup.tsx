import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql_utils/mutations';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [userFormData, setUserFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [createUser] = useMutation(CREATE_USER);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await createUser({ variables: { ...userFormData } });

      if (data?.createUser?.token) {
        signup(userFormData.username, userFormData.email, userFormData.password); // Pass token here
        toast.success('Sign up successful! Please login');
        navigate('/login')
      } else {
        throw new Error('Sign up failed.');
      }
    } catch (err: any) {
      // Check if the error is due to duplicate user or other validation issues
      if (err?.message?.includes('duplicate key error') || err?.message?.includes('E11000')) {
        toast.error('This email or username is already taken.');
      } else if (err?.message?.includes('validation failed')) {
        toast.error('Please fill in all required fields.');
      } else {
        toast.error('Error during sign up: ' + err?.message || 'Unknown error');
      }
    }
  };

  return (
    <main className="bg-2">
      <section className="section-container grid-center">
        <form onSubmit={handleFormSubmit} className="form">
          <h1>Sign Up</h1>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />

          <div className='grid gap-2 text-center pt-2'>
            <button
              disabled={!(userFormData.email && userFormData.username && userFormData.password)}
              type="submit"
              className='btn btn--main'
            >
              Sign Up
            </button>
            <p className='inline-flex gap-2 text-sm pt-2'>
              <span>Already have an account?</span>
              <Link to={'/login'}>Log in</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};
