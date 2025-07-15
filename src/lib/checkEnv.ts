/**
 * Utility to check if environment variables are loaded correctly
 */

export const checkEnvironment = () => {
  console.log('Checking environment variables:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
  
  // Other environment variables you might have
  console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME);
  console.log('VITE_ENVIRONMENT:', import.meta.env.VITE_ENVIRONMENT);
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables are missing!');
    return false;
  }
  
  return true;
}; 