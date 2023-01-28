const resetPasswordMarkup = function (OTP) {
  return `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Your OTP code is below:</title>
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:800px;overflow:auto;line-height:2">
  <div style="margin:10px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Leopards Team</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Leopards Team. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Leopards Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
  </div>
</div>
<!-- partial -->
  
</body>
</html>`;
};

module.exports = resetPasswordMarkup;
