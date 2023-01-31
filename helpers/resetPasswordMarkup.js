const resetPasswordMarkup = function (link) {
  return `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Your reset link:</title>
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:800px;overflow:auto;line-height:2">
  <div style="margin:10px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="https://jekiekolya.github.io/wallet-leopards-team-FRONTEND" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Wallet</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Wallet.</p>
     <p>Use the following link to complete your Password Recovery Procedure. Link is valid for 5 minutes</p>
    <a href="${link}" target="_blank" style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">RESET PASSWORD LINK</a>
    <p style="font-size:0.9em;">Regards,<br />Leopards Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
  </div>
</div>
<!-- partial -->
  
</body>
</html>`;
};

module.exports = resetPasswordMarkup;
