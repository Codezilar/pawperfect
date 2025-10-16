import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { 
      giftCardCode, 
      giftCardPin, 
      giftCardProvider, 
      customerEmail, 
      customerPhone, 
      customerName, 
      orderAmount, 
      dogDetails 
    } = await request.json();

    console.log('Received gift card notification request:', {
      giftCardProvider,
      customerEmail,
      customerName
    });

    // Send email notification to admin
    const adminResult = await sendAdminNotification({
      giftCardCode,
      giftCardPin,
      giftCardProvider,
      customerEmail,
      customerPhone,
      customerName,
      orderAmount,
      dogDetails
    });

    // Send confirmation email to customer
    const customerResult = await sendCustomerConfirmation({
      customerEmail,
      customerName,
      orderAmount,
      dogDetails,
      giftCardProvider
    });

    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully',
      adminEmail: adminResult,
      customerEmail: customerResult
    });

  } catch (error) {
    console.error('Gift card notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails: ' + error.message },
      { status: 500 }
    );
  }
}

// Send email to admin with gift card details
async function sendAdminNotification(data) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Get both admin emails from environment variables
    const adminEmail1 = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const adminEmail2 = process.env.ADMIN_EMAIL_Two;
    
    // Combine both admin emails into a single string for the 'to' field
    const adminEmails = [adminEmail1, adminEmail2].filter(email => email).join(', ');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails,
      subject: `🎁 New Gift Card Order - ${data.giftCardProvider}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">🎁 New Gift Card Order Received</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #555;">Customer Information</h3>
            <p><strong>Name:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>WhatsApp Number:</strong> ${data.customerPhone}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #856404;">Gift Card Details</h3>
            <p><strong>Provider:</strong> ${data.giftCardProvider}</p>
            <p><strong>Gift Card Code:</strong> <code style="background: #2d3748; color: white; padding: 8px 12px; border-radius: 4px; font-size: 16px; font-weight: bold;">${data.giftCardCode}</code></p>
            ${data.giftCardPin ? `<p><strong>PIN:</strong> <code style="background: #2d3748; color: white; padding: 8px 12px; border-radius: 4px; font-size: 16px; font-weight: bold;">${data.giftCardPin}</code></p>` : ''}
            <p><strong>Order Amount:</strong> $${data.orderAmount}</p>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #004085;">Order Details</h3>
            <p><strong>Dog:</strong> ${data.dogDetails.dogName}</p>
            <p><strong>Breed:</strong> ${data.dogDetails.breed}</p>
            <p><strong>Price:</strong> $${data.dogDetails.price}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully to:', adminEmails);
    return { success: true, messageId: result.messageId, recipients: adminEmails };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(data) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"PawPerfect" <${process.env.EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `🎉 Order Confirmation - PawPerfect`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Thank you for your purchase!</p>
          </div>
          
          <div style="background: #f0fff4; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Hello ${data.customerName},</h3>
            <p style="color: #4a5568; line-height: 1.6;">Your order has been successfully received and is being processed. We're excited to help you welcome your new furry friend!</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Summary</h3>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="font-weight: bold; color: #4a5568;">Dog:</span>
              <span style="color: #2d3748;">${data.dogDetails.dogName}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="font-weight: bold; color: #4a5568;">Breed:</span>
              <span style="color: #2d3748;">${data.dogDetails.breed}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="font-weight: bold; color: #4a5568;">Amount Paid:</span>
              <span style="color: #2d3748; font-weight: bold;">$${data.orderAmount}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="font-weight: bold; color: #4a5568;">Payment Method:</span>
              <span style="color: #2d3748;">${data.giftCardProvider} Gift Card</span>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📋 What's Next?</h4>
            <ul style="color: #856404; padding-left: 20px;">
              <li>Our team will contact you within 24 hours</li>
              <li>We'll schedule a pickup/delivery time</li>
              <li>Prepare necessary documents for adoption</li>
            </ul>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #004085; margin: 0;">
              <strong>Need help?</strong> Contact us at 
              <a href="mailto:support@pawperfect.com" style="color: #0056b3; text-decoration: none;"> support@pawperfect.com</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px;">
              Thank you for choosing PawPerfect! 🐾<br>
              We're excited to help you find your perfect companion.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Customer confirmation sent successfully to:', data.customerEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error: error.message };
  }
}