'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signup(email, password, username, firstName, lastName);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="w-full max-w-md bg-secondary/50 backdrop-blur-md border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h1>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-accent" required />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-accent" required />
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-accent" />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 mb-4 focus:outline-none focus:border-accent" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 mb-6 focus:outline-none focus:border-accent" required />
          <button type="submit" disabled={isLoading} className="w-full bg-accent text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50">{isLoading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        
        <p className="text-gray-400 text-center mt-4">Already have an account? <Link href="/login" className="text-accent hover:underline">Login</Link></p>
      </div>
    </div>
  );
}
