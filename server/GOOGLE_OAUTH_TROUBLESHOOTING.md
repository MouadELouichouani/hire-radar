# Google OAuth 404 Error - Troubleshooting

## ✅ Routes Are Fixed

The routes are now correctly registered using `auth.add_url_rule()`. The route `/api/auth/google` should work.

## 🔍 Check These Things

### 1. **Flask Server is Running**
```bash
# Make sure your Flask server is running on port 5000
cd server/api
python3 server.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### 2. **Check Environment Variable**
Make sure `NEXT_PUBLIC_API_BASE_URL` is set in your frontend:

**File: `client/.env.local` or `client/.env`**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. **Test the Route Directly**
```bash
# Test if the route exists
curl http://localhost:5000/api/auth/google
```

**Expected response:**
```json
{"auth_url": "https://accounts.google.com/o/oauth2/auth?..."}
```

**If you get 404:**
- Flask server might not be running
- Route might not be registered
- Check Flask server logs for errors

### 4. **Check Flask Server Logs**
When you click "Sign in with Google", check your Flask server terminal. You should see:
```
127.0.0.1 - - [DATE] "GET /api/auth/google HTTP/1.1" 200 -
```

If you see `404`, the route isn't being found.

### 5. **Verify Route Registration**
The routes are registered in `server/api/routes/auth.py`:
```python
auth.add_url_rule("/google", "google_login", google_login, methods=["GET"])
```

And the blueprint is registered in `server/api/server.py`:
```python
app.register_blueprint(auth, url_prefix="/api/auth")
```

This creates the route: `GET /api/auth/google`

### 6. **Restart Flask Server**
After making changes, **always restart your Flask server**:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd server/api
python3 server.py
```

### 7. **Check Browser Console**
Open browser DevTools (F12) → Network tab → Click "Sign in with Google"
- Look for the request to `/auth/google`
- Check the full URL it's trying to access
- Check the response status code

### 8. **Common Issues**

#### Issue: "Cannot GET /api/auth/google"
**Solution**: Flask server not running or route not registered

#### Issue: "Network Error" or "CORS error"
**Solution**: Check CORS configuration in `server.py`:
```python
CORS(app, origins=["http://localhost:3000"])
```

#### Issue: "404 Not Found" from axios
**Solution**: Check `NEXT_PUBLIC_API_BASE_URL` environment variable

## 🧪 Quick Test

Run this to verify everything:

```bash
# Terminal 1: Start Flask server
cd server/api
python3 server.py

# Terminal 2: Test the route
curl http://localhost:5000/api/auth/google

# Should return JSON with auth_url
```

## 📝 Summary

1. ✅ Routes are correctly registered
2. ⚠️ Make sure Flask server is running
3. ⚠️ Check `NEXT_PUBLIC_API_BASE_URL` environment variable
4. ⚠️ Restart Flask server after changes
5. ⚠️ Check browser Network tab for actual request URL

