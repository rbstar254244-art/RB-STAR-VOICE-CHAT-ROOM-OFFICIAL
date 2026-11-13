# RB STAR Voice Chat Room — InfinityFree Hosting & MySQL Deployment Guide

This project is pre-configured with a **React + Vite (Relative Path Build)** frontend, a **PHP 8 REST Backend** (`public/api/`), **Apache SPA & Security Rules** (`public/.htaccess`), and a **16-Table MySQL / MariaDB Schema** (`database/infinityfree_schema.sql`) designed specifically for **InfinityFree** free shared hosting.

---

## Architecture Overview

- **Frontend (`/dist/`)**: Built with `vite build` using `base: './'` so all JS, CSS, and asset URLs load cleanly on any InfinityFree domain or subdomain.
- **Apache Rewrite & Security (`/dist/.htaccess`)**:
  - Passes `/api/*.php` directly to InfinityFree's PHP 8 engine.
  - Rewrites frontend routes to `index.html`.
  - Blocks HTTP downloads of `config.php`, `.sql`, `.env`, `.log`, and `.md` files.
- **PHP 8 REST API (`/dist/api/`)**:
  - `config.php`: MySQL PDO connection + HMAC-SHA256 stateless Bearer token helpers.
  - `auth.php`: Admin login (`BCRYPT` password verification + MySQL IP brute-force lockout) & password update.
  - `public.php`: Public read endpoint (strips private API keys & sensitive CNIC data), ID verification lookup, and public staff onboarding submission.
  - `sync.php`: Authenticated full-portal read/write sync across all 16 MySQL tables inside a database transaction.
  - `webhook.php`: Mobile Voice App integration webhook (`X-RBSTAR-API-KEY` header) supporting `PING`, `VERIFY_ID`, `BAN_USER`, and `UNBAN_USER`.
- **MySQL Database (`/database/infinityfree_schema.sql`)**:
  - Prepared strictly for InfinityFree **phpMyAdmin** (no forbidden `CREATE DATABASE` or `USE` statements, `utf8mb4_unicode_ci`, `InnoDB`).

---

## Step-by-Step Deployment on InfinityFree

### Step 1: Build the Production Bundle
Run the production build locally:
```bash
npm install
npm run build
```
This generates the complete upload-ready `/dist` folder containing `index.html`, `assets/`, `.htaccess`, and `api/*.php`.

---

### Step 2: Create a MySQL Database on InfinityFree
1. Log in to your **InfinityFree Client Area** -> Open your Hosting Account -> **Control Panel (vPanel)**.
2. Open **MySQL Databases** and create a new database (e.g., `rbstar`).
3. Note down the 4 values shown in InfinityFree MySQL Databases:
   - **MySQL Host Name** (e.g., `sql308.infinityfree.com`)
   - **MySQL Database Name** (e.g., `if0_38XXXXXX_rbstar`)
   - **MySQL User Name** (e.g., `if0_38XXXXXX`)
   - **MySQL Password** (your hosting/vPanel password)
4. Click **phpMyAdmin** next to your newly created database.
5. Open the **Import** tab, select `database/infinityfree_schema.sql`, and click **Import / Go**.
   - All 16 tables and initial seed records will be created automatically.

---

### Step 3: Upload Files to `htdocs/`
1. Open the InfinityFree **Online File Manager** (or connect via FTP with FileZilla).
2. Navigate into the `htdocs/` folder of your domain/subdomain.
3. Upload the **entire contents** of your built `dist/` folder directly inside `htdocs/`:
   - `htdocs/index.html`
   - `htdocs/.htaccess`
   - `htdocs/assets/...`
   - `htdocs/api/config.php`
   - `htdocs/api/auth.php`
   - `htdocs/api/public.php`
   - `htdocs/api/sync.php`
   - `htdocs/api/webhook.php`

---

### Step 4: Configure `htdocs/api/config.php`
Edit `htdocs/api/config.php` in the InfinityFree File Manager and replace the database placeholders with your exact InfinityFree MySQL details:

```php
define('DB_HOST', 'sql308.infinityfree.com');
define('DB_NAME', 'if0_38XXXXXX_rbstar');
define('DB_USER', 'if0_38XXXXXX');
define('DB_PASS', 'YOUR_V_PANEL_PASSWORD');

// Replace with a long random string (32+ characters)
define('APP_AUTH_SECRET', 'CHANGE_THIS_TO_A_UNIQUE_RANDOM_SECRET_KEY');
```

Save the file.

---

### Step 5: Verify & Change Default Admin Password
1. Visit your InfinityFree website URL in your browser.
2. Click **Admin Login** and sign in with the seeded default password: `admin`.
   - On first login, PHP automatically upgrades `INIT_DEFAULT_ADMIN` in MySQL to a secure `PASSWORD_BCRYPT` hash.
3. Immediately go to **Settings** or open the **Security** modal to set your own strong custom Master Password.
4. Visit **App Connect & API** to confirm the status badge reads **`CONNECTED TO MYSQL`** and **`16 MySQL Tables Active`**.

---

## Troubleshooting on InfinityFree
- **500 Error or DB Config Notice**: Double-check `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS` inside `htdocs/api/config.php`. Remember InfinityFree does not use `localhost` for `DB_HOST` (it uses `sqlXXX.infinityfree.com`).
- **404 on Refresh**: Confirm `htdocs/.htaccess` was uploaded cleanly (FileZilla/File Manager sometimes hides dotfiles unless "Show Hidden Files" is enabled).
- **PHP Version**: In InfinityFree vPanel -> **Select PHP Version**, ensure PHP **8.1+** is active (with `pdo_mysql` enabled by default).
