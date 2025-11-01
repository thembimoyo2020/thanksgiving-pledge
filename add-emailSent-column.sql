-- Migration: Add emailSent column to pledges table
-- This adds the missing column without deleting any existing data

ALTER TABLE pledges 
ADD COLUMN emailSent TINYINT NOT NULL DEFAULT 0 COMMENT '0 = not sent, 1 = sent';

-- Verify the column was added
DESCRIBE pledges;

SELECT 'emailSent column added successfully!' AS Status;
