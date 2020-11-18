const nodemailer = require(`nodemailer`);

const mailer = (user, done) => {
  let mailResult;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yTo4ka13@gmail.com",
      pass: "100500qwE",
    },
  });

  const mailOptions = {
    from: "yTo4ka13@gmail.com",
    to: user.email,
    subject: "Email confirmation | Rainbow",
    html: `
    <div>
      <h1>Rainbow</h1>
      <p>Welcome, ${user.givenName}! 
        You have to confirm your email. To do that, process to this link:
        http://localhost:3000/auth/confirm/${user.accountActivationToken}.
      </p>
      <p>
        If you did not register account - just ignore this message.
      </p>
      <p>
        With respect, Rainbow development team.
      </p>
    </div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      mailResult = JSON.stringify({
        isSuccessful: false,
        message: error,
      });
      done(mailResult);
    } else {
      mailResult = JSON.stringify({
        isSuccessful: true,
        message: `Confirmation link was send`,
      });
      done(mailResult);
    }
  });
};

module.exports = mailer;
