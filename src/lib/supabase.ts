import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { checkEnvironment } from './checkEnv';

// Check if environment variables are loaded
const envCheck = checkEnvironment();

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log missing configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase configuration is missing. Please check your .env file.');
  console.error('You must have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
console.log('✅ Supabase client initialized successfully');

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
}; 