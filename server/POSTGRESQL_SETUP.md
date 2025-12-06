# PostgreSQL Setup and Connection Guide

## 1. Install PostgreSQL (if not installed)

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Arch Linux:
```bash
sudo pacman -S postgresql
```

### macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

## 2. Start PostgreSQL Service

### Check if PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

### Start PostgreSQL:
```bash
sudo systemctl start postgresql
```

### Enable PostgreSQL to start on boot:
```bash
sudo systemctl enable postgresql
```

### Alternative (if systemctl doesn't work):
```bash
sudo service postgresql start
```

## 3. Create Database and User

### Option A: Using psql (Recommended)

1. Switch to postgres user:
```bash
sudo -u postgres psql
```

2. Create database and user:
```sql
-- Create database
CREATE DATABASE hireradar;

-- Create user (if needed)
CREATE USER postgres WITH PASSWORD '1234';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hireradar TO postgres;

-- Exit psql
\q
```

### Option B: Using createdb command
```bash
sudo -u postgres createdb hireradar
```

## 4. Configure Environment Variables

Create or update `.env` file in `server/` directory:

```env
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hireradar
```

## 5. Test Database Connection

### Method 1: Using the check script
```bash
cd server
source .env  # Load environment variables
./scripts/check-db.sh
```

### Method 2: Using psql directly
```bash
psql -h localhost -U postgres -d hireradar
# Enter password when prompted
```

### Method 3: Using Python
```bash
cd server
python3 -c "
from api.config.db import engine
try:
    conn = engine.connect()
    print('✓ Database connection successful!')
    conn.close()
except Exception as e:
    print(f'✗ Database connection failed: {e}')
"
```

### Method 4: Test from your Flask app
```bash
cd server/api
python3 -c "
from config.db import engine
from sqlalchemy import text
try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version()'))
        print('✓ Database connected!')
        print(result.fetchone()[0])
except Exception as e:
    print(f'✗ Connection failed: {e}')
"
```

## 6. Common Issues and Solutions

### Issue: "Connection refused"
**Solution:**
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Check if PostgreSQL is listening on port 5432: `sudo netstat -tlnp | grep 5432`
- Check PostgreSQL configuration: `sudo nano /etc/postgresql/*/main/postgresql.conf`

### Issue: "Authentication failed"
**Solution:**
- Check password in `.env` file matches PostgreSQL user password
- Reset password: `sudo -u postgres psql -c "ALTER USER postgres PASSWORD '1234';"`

### Issue: "Database does not exist"
**Solution:**
- Create the database: `sudo -u postgres createdb hireradar`
- Or connect to default postgres database first: `psql -U postgres`

### Issue: "Permission denied"
**Solution:**
- Grant privileges: `sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hireradar TO postgres;"`

## 7. Useful PostgreSQL Commands

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# List all databases
\l

# Connect to specific database
\c hireradar

# List all tables
\dt

# Describe a table
\d table_name

# Exit psql
\q

# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
pg_isready
```

## 8. Using Docker (Alternative)

If you prefer using Docker:

```bash
cd server
docker-compose up -d
```

This will start PostgreSQL in a Docker container with the configuration from `docker-compose.yaml`.

## 9. Verify Connection from Your App

Once PostgreSQL is running and configured, start your Flask server:

```bash
cd server/api
python3 server.py
```

You should see either:
- "Database tables created successfully!" (if connection works)
- "Warning: Could not create database tables: ..." (if connection fails)

