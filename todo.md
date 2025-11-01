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
