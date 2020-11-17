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
    subject: "Email confirmation",
    text: `${`http://localhost:3000/auth/confirm/${user.accountActivationToken}`}`,
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
