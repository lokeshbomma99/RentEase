const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 30px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: #bfdbfe; margin: 5px 0 0; }
    .body { padding: 30px; color: #374151; line-height: 1.6; }
    .card { background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #2563eb; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    .badge-green { background: #d1fae5; color: #065f46; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 RentEase</h1>
      <p>Your Trusted Rental Platform</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} RentEase. All rights reserved.</div>
  </div>
</body>
</html>`;

const welcomeEmail = (name) => ({
  subject: 'Welcome to RentEase! 🏠',
  html: baseTemplate(`
    <h2>Welcome, ${name}! 👋</h2>
    <p>We are thrilled to have you on <strong>RentEase</strong> — your go-to platform for finding the perfect rental home.</p>
    <div class="card">
      <strong>What you can do:</strong><br/>
      ✅ Browse thousands of verified properties<br/>
      ✅ Book instantly with one click<br/>
      ✅ Chat with property owners<br/>
      ✅ Leave reviews after your stay
    </div>
    <p>Start exploring now and find your dream home!</p>
    <a href="${process.env.CLIENT_URL}" class="btn">Browse Properties</a>
  `)
});

const bookingRequestEmail = (ownerName, tenantName, property, booking) => ({
  subject: `New Booking Request - ${property.title}`,
  html: baseTemplate(`
    <h2>Hi ${ownerName},</h2>
    <p>You have received a new booking request for your property.</p>
    <div class="card">
      <strong>🏠 Property:</strong> ${property.title}<br/>
      <strong>👤 Tenant:</strong> ${tenantName}<br/>
      <strong>📅 From:</strong> ${new Date(booking.startDate).toLocaleDateString()}<br/>
      <strong>📅 To:</strong> ${new Date(booking.endDate).toLocaleDateString()}<br/>
      <strong>💰 Total Amount:</strong> Rs. ${booking.totalAmount?.toLocaleString()}
      ${booking.message ? `<br/><strong>💬 Message:</strong> ${booking.message}` : ''}
    </div>
    <p>Please log in to your dashboard to <strong>approve or reject</strong> this request.</p>
    <a href="${process.env.CLIENT_URL}/owner/bookings" class="btn">View Booking</a>
  `)
});

const bookingConfirmedEmail = (tenantName, property, booking) => ({
  subject: `Booking Approved! 🎉 - ${property.title}`,
  html: baseTemplate(`
    <h2>Great news, ${tenantName}! 🎉</h2>
    <p>Your booking request has been <span class="badge badge-green">Approved</span></p>
    <div class="card">
      <strong>🏠 Property:</strong> ${property.title}<br/>
      <strong>📍 Address:</strong> ${property.address?.city}, ${property.address?.state}<br/>
      <strong>📅 Move-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}<br/>
      <strong>📅 Move-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}<br/>
      <strong>💰 Total Amount:</strong> Rs. ${booking.totalAmount?.toLocaleString()}
    </div>
    <p>Please contact the owner for further details and to arrange key handover.</p>
    <a href="${process.env.CLIENT_URL}/my-bookings" class="btn">View My Bookings</a>
  `)
});

const bookingRejectedEmail = (tenantName, property, reason) => ({
  subject: `Booking Update - ${property.title}`,
  html: baseTemplate(`
    <h2>Hi ${tenantName},</h2>
    <p>We are sorry to inform you that your booking has been <span class="badge badge-red">Rejected</span></p>
    <div class="card">
      <strong>🏠 Property:</strong> ${property.title}<br/>
      ${reason ? `<strong>❌ Reason:</strong> ${reason}` : ''}
    </div>
    <p>Do not be discouraged — there are plenty of other great properties available!</p>
    <a href="${process.env.CLIENT_URL}" class="btn">Browse Other Properties</a>
  `)
});

module.exports = { welcomeEmail, bookingRequestEmail, bookingConfirmedEmail, bookingRejectedEmail };
