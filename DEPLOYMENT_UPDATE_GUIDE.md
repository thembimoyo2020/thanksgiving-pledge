# Deploying Updates to Render.com

This guide will help you deploy the latest changes (Adventist branding, stats section, pledge numbers, bank details) to your existing Render.com deployment.

---

## Prerequisites

- Your GitHub repository is already set up from the initial deployment
- Your Render.com service is already running at https://thanksgiving-pledge.onrender.com
- You have access to both GitHub and Render.com accounts

---

## Step 1: Download Updated Code

1. **Download the latest code** from the Manus project:
   - Click on the checkpoint card in Manus
   - Click the **"Dashboard"** button
   - Go to the **"Code"** tab
   - Click **"Download All Files"**
   - Save the ZIP file to your computer
   - Extract the ZIP file

---

## Step 2: Update Your GitHub Repository

### Option A: Using GitHub Web Interface (Easiest)

1. **Go to your GitHub repository**:
   - Visit https://github.com/YOUR_USERNAME/thanksgiving-pledge
   - Replace `YOUR_USERNAME` with your actual GitHub username

2. **Delete old files**:
   - Click on each folder/file in the repository
   - Click the trash icon (🗑️) to delete
   - Commit the deletion
   - **Important**: Do NOT delete the `.git` folder or `.gitignore` file if you see them

3. **Upload new files**:
   - Click **"Add file"** → **"Upload files"**
   - Drag and drop ALL files from your extracted folder
   - Make sure to include:
     - `client/` folder (with the new Adventist logo in `client/public/`)
     - `server/` folder (with updated email templates)
     - `drizzle/` folder (with pledge number schema)
     - `package.json`
     - All other files
   - Write commit message: "Update with Adventist branding and stats"
   - Click **"Commit changes"**

### Option B: Using Git Command Line (Advanced)

If you're comfortable with Git:

```bash
# Navigate to your local repository
cd path/to/thanksgiving-pledge

# Remove old files (keep .git folder)
rm -rf client server drizzle package.json

# Copy new files from extracted folder
cp -r /path/to/extracted/files/* .

# Add all changes
git add .

# Commit changes
git commit -m "Update with Adventist branding and stats"

# Push to GitHub
git push origin main
```

---

## Step 3: Render.com Will Auto-Deploy

**Good news!** Render.com automatically detects changes pushed to GitHub.

1. **Watch the deployment**:
   - Go to https://dashboard.render.com
   - Click on your **thanksgiving-pledge** service
   - You'll see a new deployment starting automatically
   - Status will show: "Building..." → "Deploying..." → "Live"

2. **Deployment takes about 5-10 minutes**:
   - Render will install dependencies
   - Build the React frontend
   - Start the Node.js server
   - Run database migrations (to add pledge number field)

3. **Check the logs**:
   - Click on the **"Logs"** tab in Render dashboard
   - Watch for any errors
   - Look for: "Server running on http://localhost:3000/"

---

## Step 4: Verify the Database Schema

The new version includes a `pledgeNumber` field in the pledges table. This should be added automatically, but verify:

1. **Check if migration ran successfully**:
   - In Render logs, look for: "migrations applied successfully!"
   
2. **If you see database errors**:
   - Go to your Render dashboard
   - Click on your service
   - Go to **"Shell"** tab
   - Run: `pnpm db:push`
   - This will manually apply the schema changes

---

## Step 5: Test Your Updated Site

1. **Visit your live site**:
   - Go to https://thanksgiving-pledge.onrender.com
   
2. **Check these new features**:
   - ✅ Adventist logo appears in header (instead of heart)
   - ✅ Blue color scheme (instead of orange)
   - ✅ Stats section shows "Total Contributions So Far" and "Balance to Go"
   - ✅ All buttons are blue
   - ✅ Items display correctly with images

3. **Test a pledge**:
   - Click "Make a Pledge" on any item
   - Fill in the form
   - Submit
   - Check your email for confirmation with:
     - Pledge number (e.g., Pledge#001)
     - TESDA bank details
     - Blue email template

4. **Check admin dashboard**:
   - Go to https://thanksgiving-pledge.onrender.com/admin
   - Login with your Manus account
   - Verify pledge numbers appear in the table
   - Test CSV export includes pledge numbers

---

## Step 6: Update Environment Variables (If Needed)

If you haven't set up email yet, add these in Render:

1. **Go to Render dashboard** → Your service → **"Environment"** tab

2. **Add these variables** (if not already added):
   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = your-email@gmail.com
   SMTP_PASSWORD = your-gmail-app-password
   SMTP_FROM_EMAIL = your-email@gmail.com
   SMTP_FROM_NAME = TESDA Church
   ```

3. **Get Gmail App Password**:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Go to "App passwords"
   - Generate a new app password for "Mail"
   - Use this 16-character password (not your regular Gmail password)

4. **Save and redeploy**:
   - Click "Save Changes"
   - Render will automatically redeploy

---

## Troubleshooting

### Issue: Site shows old orange colors

**Solution**: Hard refresh your browser
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or clear browser cache

### Issue: Database error about pledgeNumber

**Solution**: Manually run migration
1. Go to Render dashboard → Shell tab
2. Run: `pnpm db:push`
3. Restart the service

### Issue: Images not showing

**Solution**: Check if images uploaded correctly
1. Verify `client/public/adventist-logo.png` exists in GitHub
2. Verify `client/public/items/` folder has all 14 item images
3. Redeploy if files are missing

### Issue: Email not sending

**Solution**: Check SMTP settings
1. Verify all SMTP environment variables are set
2. Use Gmail App Password (not regular password)
3. Check Render logs for email errors

### Issue: Stats showing R0.00

**Solution**: This is correct if no pledges yet!
- Stats update in real-time as pledges are made
- Make a test pledge to see stats update

---

## Important Notes

### Free Tier Limitations

- Render free tier spins down after 15 minutes of inactivity
- First visit after inactivity takes 30-60 seconds to wake up
- Consider upgrading to paid tier ($7/month) for always-on service

### Database Backups

- Your cPanel MySQL database is separate from Render
- Make regular backups of your database
- Export from cPanel → Databases → phpMyAdmin

### Custom Domain

If you want to use https://tesda.org.za/thanksgiving:

1. This requires a subdomain or path-based routing
2. You'll need to set up a reverse proxy in cPanel
3. Or use Render's custom domain feature (paid plan)
4. Contact your hosting provider for assistance

---

## Summary Checklist

- [ ] Downloaded latest code from Manus
- [ ] Updated GitHub repository with new files
- [ ] Watched Render auto-deploy (5-10 minutes)
- [ ] Verified database migration succeeded
- [ ] Tested site with new Adventist branding
- [ ] Verified stats section shows correctly
- [ ] Made test pledge and received email with pledge number
- [ ] Checked admin dashboard shows pledge numbers
- [ ] Set up Gmail SMTP if not done already

---

## Need Help?

If you encounter issues:

1. **Check Render logs**: Dashboard → Your service → Logs tab
2. **Check database**: Make sure DATABASE_URL is correct
3. **Check email**: Verify SMTP credentials
4. **Test locally**: Download code and run `pnpm install && pnpm dev`

The deployment should be straightforward since your initial setup is already working. The new changes are mostly frontend updates (colors, logo, stats) that don't require complex configuration.

Good luck with your deployment! 🚀
