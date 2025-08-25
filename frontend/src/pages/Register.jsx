import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../store/actions/userActions';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
const dispatch = useDispatch()
  const onSubmit = (data) => {
    dispatch(registerUser(data))
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-500">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="John"
              />
              {errors.firstName && <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { 
                required: "Email is required", 
                pattern: { 
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
              className={`mt-1 block w-full px-4 py-2 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { 
                required: "Password is required",
                minLength: { 
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className={`mt-1 block w-full px-4 py-2 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;