# Troubleshooting Guide

This document provides solutions for common issues you might encounter while developing and deploying the Streak Refill application.

## Environment Variables

### Missing Supabase Configuration

**Symptoms:**
- "supabaseUrl is required" error
- "Supabase environment variables are missing" warning
- Mock client being used instead of real client

**Solution:**
1. Create a `.env` file in the project root with the following variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_APP_NAME=StreakRefill
   VITE_ENVIRONMENT=development
   ```

2. Make sure to restart your development server after adding the `.env` file.

3. Verify that the environment variables are loaded correctly by checking the browser console for:
   ```
   ✅ Supabase client initialized successfully
   ```

**Note:** The `VITE_` prefix is required for environment variables to be exposed to client-side code in Vite.

## Supabase API Errors

### 406 Not Acceptable Errors

**Symptoms:**
- `GET https://your-project-id.supabase.co/rest/v1/... 406 (Not Acceptable)`
- `Error finding wallet: [object Object]`

**Solution:**

This typically occurs when:

1. **Database tables don't match the expected schema:**
   - Verify that your database tables match the types defined in `src/types/database.ts`
   - Check that the table names are correct (users, stats, streaks, purchases, etc.)

2. **Row-level security policies are too restrictive:**
   - Review your RLS policies in the Supabase dashboard
   - Ensure your anonymous key has the necessary permissions

3. **API version mismatch:**
   - Make sure you're using the correct version of the Supabase JS client for your project

## Ngrok and Content Security Policy (CSP) Issues

### CSP Blocking Resources

**Symptoms:**
- `Refused to load the font '<URL>' because it violates the following Content Security Policy directive`
- Missing styles or assets when accessing via ngrok

**Solution:**

The application includes built-in CSP handling for ngrok that should resolve most issues. If you're still experiencing problems:

1. Make sure the `setupNgrokCSP()` function is called in your `main.tsx`
2. If you need to add additional resources to the CSP, modify `ngrokHelper.ts`
3. For persistent issues, consider using a browser extension to temporarily disable CSP during development

## SVG Attribute Errors

### Invalid SVG attributes

**Symptoms:**
- `Error: <svg> attribute width: Expected length, "small"`
- `Error: <svg> attribute height: Expected length, "small"`

**Solution:**

The application includes an `Icon` component that handles string size attributes. Make sure to:

1. Import and use the `Icon` component from `src/components/ui/Icon` instead of directly using phosphor-react icons
2. Pass size as a number, not a string, when using icon components directly

Example:
```tsx
// Incorrect
<ShoppingCart size="small" />

// Correct
<Icon name="ShoppingCart" size="small" />
// or
<ShoppingCart size={16} />
```

## Connection Issues

### Server Connection Lost

**Symptoms:**
- `[vite] server connection lost. Polling for restart...`
- Application stops refreshing when code changes

**Solution:**

1. Check if your development server is still running
2. Make sure you haven't exceeded memory or CPU limits
3. Try restarting the development server with:
   ```
   npm run dev
   ```

## Database Connection Issues

### Module Buffer Externalized

**Symptoms:**
- `Module "buffer" has been externalized for browser compatibility. Cannot access "buffer.Buffer" in client code`

**Solution:**

This is a Vite warning related to certain Node.js modules being used in browser code. In most cases, it won't affect functionality. If it causes issues:

1. Add the buffer polyfill in your `vite.config.ts`:
   ```ts
   define: {
     'process.env': {},
     'global': 'window',
   },
   resolve: {
     alias: {
       'buffer': 'buffer/',
     }
   },
   ```

2. Install required dependencies:
   ```
   npm install buffer
   ```

## Debugging Tips

1. Check the browser console for detailed error messages
2. Verify environment variables are loaded properly
3. Use the built-in error handling in the application
4. For Supabase issues, check the Supabase dashboard logs
5. For persistent issues, try a clean reinstall of dependencies:
   ```
   rm -rf node_modules
   npm install
   ``` 