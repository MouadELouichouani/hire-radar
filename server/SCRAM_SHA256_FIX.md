# Fix for Peer Authentication with scram-sha-256

## You DON'T need to change scram-sha-256!

`scram-sha-256` is the modern, secure authentication method. **Keep it as is.**

## The Real Issue

If you're getting "Peer authentication failed" errors even though you have `scram-sha-256`, it's likely because:

1. **There's a `local` line with `peer`** that matches before your `host` line
2. **You're connecting via Unix socket** (without `-h localhost`) which uses `local` lines
3. **Line order matters** - PostgreSQL uses the FIRST matching line

## How to Check

Run this to see your current config:

```bash
cd server
./scripts/check-pg-hba.sh
```

Or manually:
```bash
sudo grep -v "^#" /etc/postgresql/*/main/pg_hba.conf | grep -v "^$"
```

## What to Look For

Your `pg_hba.conf` should look something like this:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     scram-sha-256  # ← Good!
host    all             all             127.0.0.1/32            scram-sha-256  # ← Good!
host    all             all             ::1/128                 scram-sha-256  # ← Good!
```

**If you see any lines with `peer`, change ONLY those:**

```
local   all             all                                     peer  # ← Change this!
host    all             all             127.0.0.1/32            peer  # ← Change this!
```

Change them to:
```
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
```

## Important: Use TCP/IP Connection

Always use `-h localhost` to force TCP/IP connection:

```bash
psql -h localhost -U postgres -d hireradar
```

This ensures you're using the `host` lines (with scram-sha-256) instead of `local` lines (which might have peer).

## Quick Fix Steps

1. **Check for any `peer` entries:**
   ```bash
   sudo grep "peer" /etc/postgresql/*/main/pg_hba.conf
   ```

2. **If found, change ONLY the `peer` lines to `scram-sha-256`:**
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   # Change any 'peer' to 'scram-sha-256'
   ```

3. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

4. **Test with TCP/IP (using -h localhost):**
   ```bash
   cd server
   ./scripts/check-db.sh
   ```

## Summary

- ✅ **Keep `scram-sha-256`** - it's the best method
- ❌ **Change any `peer` entries** to `scram-sha-256`
- ✅ **Always use `-h localhost`** in connection strings
- ✅ **Check line order** - more specific rules should come first

