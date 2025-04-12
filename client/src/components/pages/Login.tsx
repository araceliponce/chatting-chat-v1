import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@/graphql_utils/mutations';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { TIME_TO_CHANGE_ROUTES } from '@/utils/constants';

export default function Login() {
  const { login } = useAuth();
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();


  const [loginMutation] = useMutation(LOGIN_USER);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginMutation({
        variables: { ...userFormData },
      });

      if (data?.login?.token) {
        login(userFormData.email, userFormData.password);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate('/')
        }, TIME_TO_CHANGE_ROUTES);
      } else {
        toast.error("Login failed. No token returned.");
      }
    } catch (err) {
      const error = err as Error;
      // console.log(err, error);
      if (error.message?.includes('Invalid credentials')) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <main className="bg-2">
      <section className="section-container grid-center">

        <form onSubmit={handleFormSubmit} className='form'>
          <h1>Welcome back!</h1>
          <label htmlFor="email">Email</label>
          <input
            type="text"
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
              disabled={!(userFormData.email && userFormData.password)}
              type="submit"
              className='btn btn--main'
            >
              Submit
            </button>
            <p className='inline-flex gap-2 text-sm pt-2'>
              <span>Don't have an account?</span>
              <Link to='/signup'> Sign up</Link>
            </p>


          </div>
        </form>
      </section>
    </main>
  );
};
