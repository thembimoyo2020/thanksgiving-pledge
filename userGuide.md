# Thanksgiving Pledge App - User Guide

## Website Information

**Purpose:** Enable community members to pledge financial support for specific items needed for the Thanksgiving initiative.

**Access:** Public access for making pledges. Admin login required for viewing pledge records.

---

## Powered by Manus

This application is built with cutting-edge web technologies for maximum performance and reliability. The frontend uses **React 19** with **TypeScript** for type-safe development and **Tailwind CSS 4** for modern, responsive design. The backend leverages **Express 4** with **tRPC 11** for end-to-end type safety and **Drizzle ORM** connecting to a **MySQL/TiDB** database for robust data management. User authentication is handled through **Manus OAuth** with JWT-based sessions. Email notifications are sent via **Nodemailer** with SMTP integration.

**Deployment:** Auto-scaling infrastructure with global CDN ensures fast load times and high availability worldwide.

---

## Using Your Website

The homepage displays all available items for the Thanksgiving initiative. Each item card shows the total cost, quantity needed, shop location, current pledge amount, and remaining balance. A visual progress bar indicates how much has been pledged toward each item.

To make a pledge, click "Make a Pledge" on any available item. A dialog opens where you enter your full name, email address, and cell number. Choose whether to pledge the full remaining amount or enter a partial amount in Rands. You must check the POPI Act consent box confirming your details will only be used for this pledge. Click "Submit Pledge" to complete your contribution. A success message appears immediately, and you receive a confirmation email with your pledge details within moments.

Items that reach their full pledge amount are automatically locked and marked with a green "Fully Pledged" badge. The system prevents over-pledging by validating your amount against the remaining balance before accepting the submission.

---

## Managing Your Website

**Admin Access:** Navigate to `/admin` and log in with your Manus account. Only users with admin role can access the dashboard.

**Admin Dashboard:** View all pledges in a searchable table showing date, donor name, email, cell number, item pledged, amount, and whether it was a full or partial pledge. The dashboard displays total pledge count and total amount collected. Use the search box to filter pledges by name, email, phone number, or item name. Click "Export CSV" to download all pledge data for record-keeping or reporting.

**Database Management:** Access the Database panel in the Management UI to view and edit items or pledges directly. Connection details are available in the bottom-left settings menu.

**Email Configuration:** Add your Gmail SMTP credentials in Settings → Secrets. You need `SMTP_HOST` (smtp.gmail.com), `SMTP_PORT` (587), `SMTP_USER` (your Gmail address), `SMTP_PASSWORD` (Gmail App Password), `SMTP_FROM_EMAIL` (same as SMTP_USER), and `SMTP_FROM_NAME` (display name for emails).

**User Roles:** Promote users to admin by editing the `role` field in the users table through the Database panel. Change from "user" to "admin" to grant dashboard access.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. You can modify item lists, adjust email templates, add reporting features, or customize the design to match your organization's branding. The application is fully functional and ready for your community to start making pledges today.
