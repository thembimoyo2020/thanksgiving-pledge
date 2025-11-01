# Thanksgiving Pledge App TODO

## Database & Backend
- [x] Create items table for pledge items
- [x] Create pledges table for tracking donations
- [x] Seed database with items from document
- [x] Create API to fetch available items with pledge status
- [x] Create API to submit pledge with validation
- [x] Create API to fetch all pledges for admin view
- [ ] Implement email notification system for pledge confirmations

## Frontend - Public Interface
- [x] Design home page layout showing available items
- [x] Display items with current pledge status and remaining amount
- [x] Create pledge form with full name, cell number, email fields
- [x] Add pledge amount selection (full or partial)
- [x] Add POPI Act consent checkbox
- [x] Implement form validation
- [x] Show success message after pledge submission
- [x] Lock fully pledged items from selection

## Frontend - Admin Dashboard
- [x] Create admin login/authentication
- [x] Build admin dashboard layout
- [x] Display all pledges in table format
- [x] Show pledge details (name, email, cell, amount)
- [x] Add filtering and search capabilities

## Email & Notifications
- [x] Configure email service
- [x] Create thank you email template
- [x] Send confirmation email after each pledge

## Testing & Deployment
- [x] Test pledge flow end-to-end
- [x] Test partial vs full pledge logic
- [x] Test item locking mechanism
- [x] Prepare deployment package for LAMP server
- [x] Create deployment documentation

## Updates
- [x] Add item images from document
- [x] Replace tagline with Bible verse "What shall I render to the Lord"

- [x] Replace all item images with clearer versions provided by user

- [x] Use full uncropped picture for refrigerator

## Church Customizations (Node.js only)
- [x] Change title to "Tshwane East Adventist Church - Thanksgiving Day Pledges"
- [x] Update "Choose an Item to Support" text
- [x] Update email thank you message
- [x] Change email signature to "TESDA Church"
- [x] Add auto-numbering for pledges (Pledge#001)
- [x] Include TESDA bank account details in email
- [x] Update POPI consent text

## Adventist Branding
- [x] Replace heart icon with Adventist logo
- [x] Update color scheme from orange to Adventist blue
- [x] Update button colors to match adventist.org
- [x] Add real-time stats section showing total contributions and balance remaining

## Deployment Issues
- [x] Replace OAuth with basic username/password authentication for admin
- [x] Fix pledge creation requiring authentication (should be public)
- [x] Add "Local Church Budget" item (R20,000) with Adventist logo
- [ ] Add missing emailSent column to production database
- [x] Fix admin login redirect loop on custom domain
