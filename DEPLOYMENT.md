# Deployment Guide - Node.js Version (Render.com)

This guide will help you deploy the Thanksgiving Pledge app to Render.com.

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- MySQL database (TiDB Cloud free tier recommended, or any MySQL provider)
- Gmail account for SMTP email

## Step 1: Prepare Your Repository

### Option A: Using the Manus Project

1. Download your project from the Manus interface
2. Extract the files to a local directory
3. Initialize a git repository:
```bash
cd thanksgiving-pledge
git init
git add .
git commit -m "Initial commit"
```

### Option B: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/thanksgiving-pledge.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Database (TiDB Cloud - Free Tier)

1. Go to https://tidbcloud.com
2. Sign up for a free account
3. Create a new cluster (Serverless Tier - Free)
4. Wait for cluster to be ready (2-3 minutes)
5. Click "Connect" and copy the connection string
6. It will look like: `mysql://username:password@gateway.tidbcloud.com:4000/database_name`

### Import Database Schema

1. Install MySQL client locally or use TiDB Cloud's SQL Editor
2. Run the migration:
```bash
# The schema is already in drizzle/0001_perfect_bloodscream.sql
# You can run it directly in TiDB Cloud SQL Editor
```

3. Seed the data by running the seed script:
```bash
pnpm exec tsx seed-items.ts
```

Or manually insert via SQL:
```sql
-- Copy the INSERT statements from the seed-items.ts file
```

## Step 3: Deploy to Render.com

### Create Web Service

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name**: `thanksgiving-pledge` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**: `pnpm install && pnpm db:push`
- **Start Command**: `pnpm start`
- **Instance Type**: Free (or upgrade for better performance)

### Environment Variables

Click "Advanced" and add these environment variables:

**Database:**
```
DATABASE_URL=mysql://your-tidb-connection-string
```

**SMTP Email (Gmail):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Thanksgiving Pledge
```

**JWT Secret (generate a random string):**
```
JWT_SECRET=your-random-secret-key-here
```

**OAuth (Manus - if using authentication):**
```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
```

**App Branding:**
```
VITE_APP_TITLE=Thanksgiving Pledge App
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

4. Click "Create Web Service"

## Step 4: Get Gmail App Password

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Scroll down to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Name it "Thanksgiving Pledge"
6. Copy the 16-character password
7. Add it to `SMTP_PASSWORD` environment variable in Render

## Step 5: Configure Admin Access

After deployment, you need to set yourself as admin:

1. Access your database (TiDB Cloud SQL Editor)
2. Find your user record:
```sql
SELECT * FROM users WHERE email = 'your-email@gmail.com';
```

3. Update your role to admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

## Step 6: Custom Domain (Optional)

### Using Render's Domain
Your app will be available at: `https://thanksgiving-pledge.onrender.com`

### Using Your Own Domain (tesda.org.za)

1. In Render dashboard, go to your service → Settings → Custom Domains
2. Click "Add Custom Domain"
3. Enter: `thanksgiving.tesda.org.za`
4. Render will provide DNS records
5. Add these records to your domain's DNS:
```
Type: CNAME
Name: thanksgiving
Value: thanksgiving-pledge.onrender.com
```

6. Wait for DNS propagation (5-60 minutes)
7. Render will automatically provision SSL certificate

## Step 7: Verify Deployment

1. Visit your deployed URL
2. Check that all items display correctly
3. Test making a pledge
4. Verify email confirmation is sent
5. Login to admin dashboard at `/admin`
6. Verify pledge appears in admin panel

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

### Database Connection Errors
- Verify TiDB connection string is correct
- Check that database is running
- Ensure IP whitelist allows Render (TiDB Cloud allows all by default)

### Emails Not Sending
- Verify Gmail App Password is correct (not regular password)
- Check SMTP environment variables
- Look for email errors in Render logs

### Admin Access Issues
- Verify you've updated your user role to 'admin' in database
- Clear browser cookies and try again
- Check OAuth environment variables

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and bandwidth usage
- **Alerts**: Set up email alerts for service health

## Scaling

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Upgrade Options:**
- **Starter ($7/month)**: Always on, no spin-down
- **Standard ($25/month)**: More resources, better performance

## Backup

### Database Backups
- TiDB Cloud automatically backs up your data
- You can also export manually from SQL Editor

### Code Backups
- Your code is in GitHub (version controlled)
- Render automatically deploys from your repo

## Updates

To update your app:
1. Make changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update description"
git push
```
3. Render automatically deploys the changes

## Cost Estimate

**Free Tier:**
- Render Web Service: Free (with limitations)
- TiDB Cloud: Free (up to 5GB storage)
- Gmail SMTP: Free
- **Total: $0/month**

**Recommended Production:**
- Render Starter: $7/month
- TiDB Cloud: Free tier sufficient
- **Total: $7/month**

## Support

- **Render Docs**: https://render.com/docs
- **TiDB Docs**: https://docs.pingcap.com/tidbcloud
- **GitHub Issues**: Create issues in your repository

## Security Checklist

- ✅ Use HTTPS (automatic with Render)
- ✅ Use environment variables for secrets
- ✅ Enable 2FA on GitHub and Render accounts
- ✅ Use strong JWT_SECRET
- ✅ Use Gmail App Password (not regular password)
- ✅ Regularly update dependencies
- ✅ Monitor logs for suspicious activity

---

**Deployment Complete!** Your Thanksgiving Pledge app is now live and ready to accept pledges from your community.
