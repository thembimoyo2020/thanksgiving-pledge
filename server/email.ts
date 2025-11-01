import nodemailer from "nodemailer";

// SMTP Configuration - these should be set in environment variables
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "";
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || "Thanksgiving Pledge";

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

interface PledgeEmailData {
  fullName: string;
  email: string;
  itemName: string;
  amount: number; // in Rands
  isFull: boolean;
  itemTotalPrice: number; // in Rands
  pledgeNumber: string;
}

export async function sendPledgeConfirmationEmail(data: PledgeEmailData): Promise<boolean> {
  // Skip if SMTP not configured
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.warn("[Email] SMTP not configured. Skipping email send.");
    return false;
  }

  try {
    const transport = getTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #456380 0%, #2563eb 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .pledge-details {
      background: #fef3c7;
      border-left: 4px solid #456380;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .pledge-details h2 {
      margin-top: 0;
      color: #92400e;
      font-size: 18px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #fde68a;
    }
    .detail-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 18px;
      color: #92400e;
    }
    .detail-label {
      color: #78350f;
      font-weight: 500;
    }
    .detail-value {
      color: #92400e;
      font-weight: 600;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
      color: #6b7280;
      font-size: 14px;
    }
    .thank-you {
      color: #456380;
      font-size: 20px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🙏 Thank You for Your Pledge!</h1>
  </div>
  
  <div class="content">
    <p>Dear ${data.fullName},</p>
    
    <p>Thank you for your generous pledge for Thanksgiving to the Lord. Your offering makes a real difference in the Mission.</p>
    
    <div class="pledge-details">
      <h2>Your Pledge Details</h2>
      <div class="detail-row">
        <span class="detail-label">Item:</span>
        <span class="detail-value">${data.itemName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Item Total Cost:</span>
        <span class="detail-value">R${data.itemTotalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Pledge Type:</span>
        <span class="detail-value">${data.isFull ? "Full Amount" : "Partial Amount"}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Pledge Reference:</span>
        <span class="detail-value">${data.pledgeNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Your Pledge Amount:</span>
        <span class="detail-value">R${data.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      </div>
    </div>
    
    <div class="pledge-details">
      <h2>Bank Transfer Details</h2>
      <div class="detail-row">
        <span class="detail-label">Account Name:</span>
        <span class="detail-value">Tshwane East SDA Church</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Bank:</span>
        <span class="detail-value">ABSA Bank (Cheque Account)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Account Number:</span>
        <span class="detail-value">4067428596</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Branch:</span>
        <span class="detail-value">Menlyn Park (632005)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Reference:</span>
        <span class="detail-value">${data.pledgeNumber}</span>
      </div>
    </div>
    
    <p class="thank-you">Your generosity is deeply appreciated! ❤️</p>
    
    <p>This confirmation serves as a record of your pledge. We will be in touch with further details about fulfilling your commitment.</p>
    
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>With gratitude,<br>
    <strong>TESDA Church</strong></p>
  </div>
  
  <div class="footer">
    <p>This email was sent in accordance with the Protection of Personal Information Act (POPI Act) of South Africa.</p>
    <p>Your details will only be used for the purpose of processing this Thanksgiving pledge.</p>
  </div>
</body>
</html>
    `;

    const textContent = `
Dear ${data.fullName},

Thank you for your generous pledge for Thanksgiving to the Lord!

YOUR PLEDGE DETAILS:
Item: ${data.itemName}
Item Total Cost: R${data.itemTotalPrice.toFixed(2)}
Pledge Type: ${data.isFull ? "Full Amount" : "Partial Amount"}
Pledge Reference: ${data.pledgeNumber}
Your Pledge Amount: R${data.amount.toFixed(2)}

BANK TRANSFER DETAILS:
Account Name: Tshwane East SDA Church
Bank: ABSA Bank (Cheque Account)
Account Number: 4067428596
Branch: Menlyn Park (632005)
Reference: ${data.pledgeNumber}

Your generosity is deeply appreciated!

This confirmation serves as a record of your pledge. We will be in touch with further details about fulfilling your commitment.

If you have any questions or concerns, please don't hesitate to reach out to us.

With gratitude,
TESDA Church

---
This email was sent in accordance with the Protection of Personal Information Act (POPI Act) of South Africa.
Your details will only be used for the purpose of processing this Thanksgiving pledge.
    `;

    await transport.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: data.email,
      subject: "Thank You for Your Thanksgiving Pledge! 🙏",
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email] Confirmation sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send confirmation:", error);
    return false;
  }
}

// Test SMTP connection
export async function testSMTPConnection(): Promise<boolean> {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.warn("[Email] SMTP credentials not configured");
    return false;
  }

  try {
    const transport = getTransporter();
    await transport.verify();
    console.log("[Email] SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("[Email] SMTP connection failed:", error);
    return false;
  }
}
