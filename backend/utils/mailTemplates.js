const otpMailTemplate = (otpCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8; padding:40px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td align="center" style="padding:35px 20px; background:linear-gradient(135deg,#111827,#1f2937);">

<div style="font-size:32px; font-weight:800; letter-spacing:2px; color:#ffffff;">
YOUR OWN STORE
</div>

<div style="margin-top:10px; font-size:14px; color:#d1d5db; letter-spacing:1px;">
Premium Shopping Experience
</div>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px 35px; text-align:center;">

<h2 style="margin:0; font-size:28px; color:#111827;">
Verify Your Login
</h2>

<p style="margin:18px 0 10px; font-size:16px; line-height:1.7; color:#4b5563;">
Use the One-Time Password below to continue securely into your account.
This code expires shortly for your protection.
</p>

<!-- OTP Box -->
<div style="margin:35px auto; display:inline-block; padding:18px 40px; background:#f9fafb; border:2px dashed #d1d5db; border-radius:14px;">

<span style="font-size:38px; font-weight:800; letter-spacing:10px; color:#111827;">
${otpCode}
</span>

</div>

<p style="margin:10px 0 0; font-size:14px; color:#6b7280;">
Enter this code in the verification page.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:28px 25px; background:#f9fafb; border-top:1px solid #e5e7eb;">

<p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
If you did not request this code, please ignore this email.
</p>

<p style="margin:10px 0 0; font-size:12px; color:#9ca3af;">
© 2026 YOUR OWN STORE. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

const verifyEmailTemplate = (name, verifyLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Email Verification</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 15px; background:#f4f6f8;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 12px 35px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td align="center" style="padding:38px 20px; background:linear-gradient(135deg,#0f172a,#1e293b);">

<div style="font-size:34px; font-weight:800; color:#ffffff; letter-spacing:2px;">
YOUR OWN STORE
</div>

<div style="margin-top:10px; font-size:14px; color:#cbd5e1; letter-spacing:1px;">
Premium Shopping Experience
</div>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px 35px; text-align:center;">

<h2 style="margin:0; font-size:30px; color:#111827;">
Verify Your Email
</h2>

<p style="margin:18px 0 0; font-size:16px; color:#4b5563; line-height:1.8;">
Hello ${name},
</p>

<p style="margin:14px 0 0; font-size:16px; color:#4b5563; line-height:1.8;">
Welcome to <strong>YOUR OWN STORE</strong>.  
Please confirm your email address by clicking the button below to activate your account.
</p>

<!-- CTA Button -->
<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:35px auto;">
<tr>
<td align="center" bgcolor="#111827" style="border-radius:12px;">
<a href="${verifyLink}"
   style="display:inline-block; padding:16px 34px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:12px;">
   Verify Email Address
</a>
</td>
</tr>
</table>

<p style="margin:0; font-size:14px; color:#6b7280; line-height:1.8;">
If the button does not work, copy and paste this link into your browser:
</p>

<p style="margin:12px 0 0; font-size:13px; line-height:1.8; word-break:break-all;">
<a href="${verifyLink}" style="color:#2563eb; text-decoration:none;">
${verifyLink}
</a>
</p>

<p style="margin:28px 0 0; font-size:14px; color:#6b7280;">
This verification link may expire for security reasons.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:28px 20px; background:#f9fafb; border-top:1px solid #e5e7eb;">

<p style="margin:0; font-size:13px; color:#6b7280;">
If you did not create an account, please ignore this email.
</p>

<p style="margin:10px 0 0; font-size:12px; color:#9ca3af;">
© 2026 YOUR OWN STORE. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;



module.exports = {
  otpMailTemplate,
  verifyEmailTemplate,
}