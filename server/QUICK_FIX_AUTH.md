# Quick Fix for "Peer authentication failed" Error

## The Problem
PostgreSQL is trying to use "peer" authentication, which requires your system username to match the PostgreSQL username. This fails when connecting as `postgres` user from a different system user.

## Quick Solutions

### Solution 1: Use TCP/IP Connection (Easiest)
Always specify `-h localhost` to force TCP/IP connection which uses password authentication:

```bash
psql -h localhost -U postgres -d hireradar
```

### Solution 2: Fix PostgreSQL Authentication Config (Recommended)

1. **Find the pg_hba.conf file:**
```bash
sudo find /etc -name pg_hba.conf 2>/dev/null
# OR
sudo find /var/lib -name pg_hba.conf 2>/dev/null
```

2. **Edit the file:**
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

3. **Find and change these lines:**
   - Find: `local   all             all                                     peer`
   - Change to: `local   all             all                                     md5`
   
   - Find: `host    all             all             127.0.0.1/32            peer`
   - Change to: `host    all             all             127.0.0.1/32            md5`

4. **Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

5. **Test connection:**
```bash
psql -h localhost -U postgres -d hireradar
# Enter password when prompted
```

### Solution 3: Connect as System User (Temporary Workaround)

If your system username matches a PostgreSQL user, you can connect without password:

```bash
sudo -u postgres psql
# Then inside psql:
\c hireradar
```

### Solution 4: Use sudo to switch user

```bash
sudo -u postgres psql -d hireradar
```

## Verify Your Configuration

After fixing, test with:

```bash
cd server
./scripts/check-db.sh
```

Or manually:
```bash
PGPASSWORD=postgres1 psql -h localhost -U postgres -d hireradar -c "SELECT version();"
```

## Common pg_hba.conf Locations

- `/etc/postgresql/[version]/main/pg_hba.conf` (Debian/Ubuntu)
- `/var/lib/pgsql/data/pg_hba.conf` (Red Hat/CentOS)
- `/usr/local/pgsql/data/pg_hba.conf` (Source installation)

## Authentication Methods Explained

- **peer**: Uses system username (fails if usernames don't match)
- **md5**: Password authentication (MD5 hash)
- **scram-sha-256**: Modern password authentication (recommended)
- **trust**: No password required (NOT recommended for production)

