# Google OAuth Fixes

## Issues Fixed

### 1. **Callback Route (`/api/auth/google/callback/route.ts`)**
   - ❌ **Before**: Used `process.env.NEXT_APP_URL!` (doesn't exist)
   - ✅ **After**: Uses `process.env.NEXT_PUBLIC_APP_URL` with fallback to `http://localhost:3000`
   - ✅ Added comprehensive error handling
   - ✅ Proper cookie settings (httpOnly, secure, sameSite)
   - ✅ Redirects to login page with error messages on failure

### 2. **OAuth Component (`o-auth.tsx`)**
   - ✅ Added toast notifications for errors
   - ✅ Better error handling with user-friendly messages
   - ✅ Proper error logging

### 3. **Login/Signup Pages**
   - ✅ Added error handling for OAuth callback errors
   - ✅ Displays toast notifications for OAuth failures
   - ✅ Checks URL query parameters for error codes

## Configuration Required

### Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# or for production:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
# or for production:
# NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Backend Configuration

Check your backend (`server/api/controllers/auth.py`):

1. **Redirect URI** - Currently hardcoded to:
   ```python
   flow.redirect_uri = "http://localhost:3000/api/auth/google/callback"
   ```
   
   This should match your frontend URL. For production, update to:
   ```python
   flow.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/api/auth/google/callback")
   ```

2. **Google OAuth Credentials** - Make sure these are set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch"
**Solution**: Make sure the redirect URI in Google Console matches exactly:
- `http://localhost:3000/api/auth/google/callback` (no trailing slash)
- Check both frontend callback route and backend redirect URI

### Issue: "missing_code" error
**Solution**: 
- Check that Google is redirecting back correctly
- Verify the callback route is accessible
- Check browser console for errors

### Issue: "auth_failed" error
**Solution**:
- Verify backend API is running
- Check backend logs for errors
- Verify Google OAuth credentials are correct
- Check that the backend can reach Google's OAuth endpoints

### Issue: Token not being set
**Solution**:
- Check browser DevTools → Application → Cookies
- Verify cookie settings (should not be httpOnly if client needs access)
- Check that `setToken` function works correctly

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Backend is running and accessible
- [ ] Google OAuth credentials are configured
- [ ] Redirect URI matches in Google Console
- [ ] Click "Sign in with Google" button
- [ ] Redirects to Google login
- [ ] After Google login, redirects back to app
- [ ] Token is set in cookies
- [ ] User is logged in and redirected to home page
- [ ] Error messages display correctly if something fails

## Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check network tab** for failed API calls
3. **Check backend logs** for server errors
4. **Verify environment variables** are loaded:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_APP_URL);
   ```
5. **Test backend endpoint directly**:
   ```bash
   curl http://localhost:5000/api/auth/google
   ```
6. **Check Google OAuth flow**:
   - Should return `auth_url` in response
   - Should redirect to Google
   - Should redirect back with `code` parameter

## Next Steps

If OAuth still doesn't work after these fixes:

1. Check backend server logs
2. Verify Google Cloud Console configuration
3. Test the backend OAuth endpoint directly
4. Check CORS settings if using different domains
5. Verify cookies are enabled in browser
