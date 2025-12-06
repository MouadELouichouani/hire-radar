# Fix "Password authentication failed" Error

## The Problem
PostgreSQL is now accepting password authentication (good!), but the password you're using doesn't match what's set in PostgreSQL.

## Quick Fix: Reset PostgreSQL Password

### Option 1: Using the script (Easiest)
```bash
cd server
./scripts/reset-postgres-password.sh postgres1
```

This will set the password to `postgres1` (or whatever you specify).

### Option 2: Manual reset
```bash
# Connect as postgres user (no password needed with sudo)
sudo -u postgres psql

# Inside psql, reset the password:
ALTER USER postgres WITH PASSWORD 'postgres1';

# Exit psql
\q
```

### Option 3: Reset from command line
```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres1';"
```

## Update Your .env File

Make sure your `server/.env` file has the matching password:

```env
DB_USERNAME=postgres
DB_PASSWORD=postgres1
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hireradar
```

## Test the Connection

After resetting the password:

```bash
cd server
./scripts/check-db.sh
```

Or manually:
```bash
PGPASSWORD=postgres1 psql -h localhost -U postgres -d hireradar -c "SELECT version();"
```

## Find Current Password (if you forgot)

If you want to check what password is currently set, you can't retrieve it (it's hashed), but you can:

1. **Check your .env file:**
   ```bash
   cat server/.env | grep DB_PASSWORD
   ```

2. **Try common passwords:**
   - `postgres` (default)
   - `postgres1`
   - `1234`
   - `password`

3. **Or just reset it** using one of the methods above.

## Common Issues

### "ALTER USER: permission denied"
- Make sure you're using `sudo -u postgres` or connecting as the postgres user

### "Password still doesn't work after reset"
- Make sure you updated your `.env` file
- Restart your Flask app to reload environment variables
- Check for typos in the password

### "Can't connect even with sudo"
- PostgreSQL might not be running: `sudo systemctl start postgresql`
- Check PostgreSQL status: `sudo systemctl status postgresql`

