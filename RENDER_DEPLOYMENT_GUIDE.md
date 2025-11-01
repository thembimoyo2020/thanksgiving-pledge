# Step-by-Step Guide: Deploy to Render.com

This guide will walk you through deploying your Thanksgiving Pledge app to Render.com from start to finish.

---

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account (free) - https://github.com/signup
- [ ] Render.com account (free) - https://render.com/register
- [ ] Gmail account for sending emails
- [ ] Your Manus project files downloaded

---

## Part 1: Prepare Your Code (GitHub)

### Step 1: Download Your Project

1. In the Manus interface, click the **Download** button on your project card
2. Extract the ZIP file to a folder on your computer (e.g., `thanksgiving-pledge`)

### Step 2: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **+** icon in the top right → **New repository**
3. Fill in:
   - **Repository name**: `thanksgiving-pledge`
   - **Description**: "Thanksgiving Pledge Application"
   - **Visibility**: Choose **Public** (required for free Render deployment)
4. Click **Create repository**

### Step 3: Upload Code to GitHub

**Option A: Using GitHub Web Interface (Easiest)**

1. On your new repository page, click **uploading an existing file**
2. Drag and drop ALL files from your extracted folder
3. Scroll down and click **Commit changes**

**Option B: Using Git Command Line**

```bash
cd path/to/thanksgiving-pledge
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thanksgiving-pledge.git
git push -u origin main
```

✅ **Checkpoint**: Your code should now be visible on GitHub at `https://github.com/YOUR-USERNAME/thanksgiving-pledge`

---

## Part 2: Set Up Database (TiDB Cloud - Free)

### Step 4: Create TiDB Cloud Account

1. Go to https://tidbcloud.com
2. Click **Sign Up** (you can use GitHub to sign in)
3. Verify your email

### Step 5: Create Database Cluster

1. Click **Create Cluster**
2. Select **Serverless** (Free tier)
3. Choose:
   - **Cloud Provider**: AWS
   - **Region**: Choose closest to your users (e.g., US East for USA)
   - **Cluster Name**: `thanksgiving-pledge`
4. Click **Create**
5. Wait 2-3 minutes for cluster to be ready

### Step 6: Get Database Connection String

1. Click **Connect** on your cluster
2. Select **General** connection type
3. Click **Generate Password** and **SAVE IT** somewhere safe
4. Copy the **Connection String** - it looks like:
   ```
   mysql://username.root:PASSWORD@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict
   ```
5. Keep this window open - you'll need it later

### Step 7: Set Up Database Tables

1. In TiDB Cloud, click **Chat2Query** or **SQL Editor**
2. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    shop VARCHAR(255),
    imageUrl VARCHAR(500),
    totalPledged INT NOT NULL DEFAULT 0,
    isLocked INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pledges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itemId INT NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    cellNumber VARCHAR(20) NOT NULL,
    amount INT NOT NULL,
    isFull INT NOT NULL DEFAULT 0,
    popiConsent INT NOT NULL DEFAULT 1,
    emailSent INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openId VARCHAR(64) NOT NULL UNIQUE,
    name TEXT,
    email VARCHAR(320),
    loginMethod VARCHAR(64),
    role VARCHAR(10) DEFAULT 'user' NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert all 14 items
INSERT INTO items (name, description, price, quantity, shop, imageUrl, totalPledged, isLocked) VALUES
('Air conditioning for MPH', 'Air conditioning system for MPH', 45500000, 1, 'Stadom Construction', '/items/aircon.png', 0, 0),
('Gate (next to the hall)', 'Gate installation next to the hall', 709900, 1, 'N/A', '/items/gate.webp', 0, 0),
('Refrigerators', 'Refrigerators for the facility', 1380000, 2, 'Makro', '/items/refrigerator.webp', 0, 0),
('Gas stove 3 burners', '3-burner gas stove', 250000, 2, 'Builders/Makro', '/items/gasstove.png', 0, 0),
('Plastic Folding Tables', 'Plastic folding tables', 52000, 10, 'Makro', '/items/plastic-table.webp', 0, 0),
('Steel Folding tables', 'Steel folding tables', 72900, 5, 'Makro', '/items/steel-table.jpg', 0, 0),
('Black Chafing Dishes (round)', 'Round black chafing dishes', 169900, 12, 'Makro or TNT catering', '/items/chafing-round.jpg', 0, 0),
('Black Chafing Dishes (rectangular)', 'Rectangular black chafing dishes', 189000, 12, 'Makro or TNT catering', '/items/chafing-rect.webp', 0, 0),
('Outdoor plants', 'Outdoor plants for landscaping', 250000, 2, 'N/A', '/items/plants.webp', 0, 0),
('Shure SLX24DE/SM58 Dual Microphone', 'Shure dual microphone system', 3297800, 2, 'Take a lot', '/items/microphone.jpg', 0, 0),
('Roof paint', 'Roof paint', 189800, 1, 'Chamberlain', '/items/roofpaint.webp', 0, 0),
('Tiles for stairs and ramp', 'Tiles for the stairs and ramp', 5852500, 1, 'Verene Tiles', '/items/tiles.png', 0, 0),
('Cushions for reception couches', 'Cushions for the reception area couches', 25000, 2, 'N/A', '/items/cushions.png', 0, 0),
('Rug for the stage', 'Rug for the stage area', 650000, 1, 'N/A', '/items/rug.jpg', 0, 0);
```

3. Click **Run** or **Execute**
4. Verify tables were created successfully

✅ **Checkpoint**: Your database is ready with all tables and items

---

## Part 3: Get Gmail App Password

### Step 8: Create Gmail App Password

1. Go to https://myaccount.google.com
2. Click **Security** in the left menu
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select:
   - **App**: Mail
   - **Device**: Other (Custom name) → type "Thanksgiving Pledge"
7. Click **Generate**
8. **COPY THE 16-CHARACTER PASSWORD** (looks like: `abcd efgh ijkl mnop`)
9. Save it somewhere safe - you'll need it in the next step

✅ **Checkpoint**: You have your Gmail app password

---

## Part 4: Deploy to Render.com

### Step 9: Create Render Account & Connect GitHub

1. Go to https://render.com/register
2. Sign up (easiest with GitHub account)
3. Once logged in, click **Dashboard**

### Step 10: Create Web Service

1. Click **New +** → **Web Service**
2. Click **Connect a repository**
3. If this is your first time:
   - Click **Configure account**
   - Select your GitHub account
   - Choose **All repositories** or select `thanksgiving-pledge`
   - Click **Install**
4. Back on Render, find `thanksgiving-pledge` and click **Connect**

### Step 11: Configure Service Settings

Fill in these settings:

**Basic Settings:**
- **Name**: `thanksgiving-pledge` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`

**Instance Type:**
- Select **Free** (or upgrade for better performance)

### Step 12: Add Environment Variables

Scroll down to **Environment Variables** section and click **Add Environment Variable**. Add each of these:

**Database:**
```
DATABASE_URL
```
Value: Paste your TiDB connection string from Step 6

**SMTP Email (Gmail):**
```
SMTP_HOST
smtp.gmail.com
```

```
SMTP_PORT
587
```

```
SMTP_USER
your-email@gmail.com
```
(Replace with YOUR Gmail address)

```
SMTP_PASSWORD
abcd efgh ijkl mnop
```
(Replace with YOUR Gmail app password from Step 8)

```
SMTP_FROM_EMAIL
your-email@gmail.com
```
(Same as SMTP_USER)

```
SMTP_FROM_NAME
Thanksgiving Pledge
```

**Security:**
```
JWT_SECRET
```
Value: Any random string (e.g., `thanksgiving2024secretkey`)

**App Settings:**
```
VITE_APP_TITLE
Thanksgiving Pledge App
```

```
VITE_APP_LOGO
https://via.placeholder.com/150
```
(You can replace with your own logo URL later)

**Manus OAuth (Required):**
```
OAUTH_SERVER_URL
https://api.manus.im
```

```
VITE_OAUTH_PORTAL_URL
https://portal.manus.im
```

```
VITE_APP_ID
your-manus-app-id
```
(Get this from your Manus project settings)

```
OWNER_OPEN_ID
your-manus-openid
```
(Get this from your Manus profile)

```
OWNER_NAME
Your Name
```

### Step 13: Deploy!

1. Click **Create Web Service** at the bottom
2. Render will start building your app (this takes 3-5 minutes)
3. Watch the logs - you'll see:
   - Installing dependencies
   - Building the app
   - Starting the server

✅ **Success!** When you see "Server running on http://localhost:3000/", your app is live!

---

## Part 5: Access Your App

### Step 14: Get Your URL

1. At the top of your Render dashboard, you'll see your app URL:
   ```
   https://thanksgiving-pledge.onrender.com
   ```
2. Click it to open your app!

### Step 15: Test Everything

1. **Homepage**: Should show all 14 items with images
2. **Make a pledge**: Click on an item and submit a test pledge
3. **Check email**: You should receive a confirmation email
4. **Admin access**: Go to `/admin` to view pledges

---

## Part 6: Custom Domain (Optional)

### Step 16: Add Your Domain (tesda.org.za/thanksgiving)

**Note**: For a subdirectory like `/thanksgiving`, you'll need to:

1. In Render, go to your service → **Settings** → **Custom Domains**
2. Click **Add Custom Domain**
3. Enter: `thanksgiving.tesda.org.za`
4. Render will give you a CNAME record:
   ```
   Type: CNAME
   Name: thanksgiving
   Value: thanksgiving-pledge.onrender.com
   ```
5. Add this to your domain's DNS settings
6. Wait 5-60 minutes for DNS to propagate
7. Render will automatically provision SSL certificate

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Look at the build logs for specific errors
- Make sure `DATABASE_URL` is correct

### App Crashes on Start
- Check the logs in Render dashboard
- Verify database connection string
- Ensure all required environment variables are present

### Emails Not Sending
- Verify Gmail app password (not regular password)
- Check SMTP settings are correct
- Look for email errors in logs

### Database Errors
- Verify TiDB cluster is running
- Check connection string format
- Ensure tables were created (Step 7)

---

## Important Notes

### Free Tier Limitations
- **Render Free**: App spins down after 15 minutes of inactivity
- **First request**: Takes 30-60 seconds to wake up
- **Upgrade to Starter ($7/month)**: Always on, no spin-down

### Costs
- **Render Free**: $0/month (with spin-down)
- **Render Starter**: $7/month (always on)
- **TiDB Cloud**: Free tier (up to 5GB storage)
- **Gmail SMTP**: Free

### Security
- Never commit `.env` files to GitHub
- Use environment variables for all secrets
- Change JWT_SECRET to a strong random value
- Keep your Gmail app password secure

---

## Next Steps

1. **Test thoroughly**: Make several test pledges
2. **Set yourself as admin**: 
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
   ```
3. **Share the URL**: Send to your community members
4. **Monitor**: Check Render logs regularly

---

## Support

- **Render Docs**: https://render.com/docs
- **TiDB Docs**: https://docs.pingcap.com/tidbcloud
- **Your App Logs**: Render Dashboard → Your Service → Logs

---

**Congratulations! Your Thanksgiving Pledge app is now live! 🎉**
