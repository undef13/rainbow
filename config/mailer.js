const nodemailer = require(`nodemailer`);

const mailer = (user, contentType, done) => {
  
  let mailResult, mailContent, mailSubject, responseMessage;

  switch (contentType) {
    case "CONFIRMATION":
      mailContent = `
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
      </div>`;
      mailSubject = `Email confirmation | Rainbow`;
      responseMessage = `Confirmation email was send.`;
      break;
    case "PASSWORD_RESET":
      mailContent = `
      <div>
        <h1>Rainbow</h1>
        <p>Hello, ${user.givenName}! 
          A request to change your password was made.
          Process this link http://localhost:3000/auth/forgot/${user.resetPasswordToken} and follow further instructions.
        </p>
        <p>
          If you did not make this request - just ignore this message.
        </p>
        <p>
          With respect, Rainbow development team.
        </p>
      </div>`;
      mailSubject = `Password reset | Rainbow`;
      responseMessage = `Instruction was send to you.`
      break;
    case "PASSWORD_RESET_SUCCESSFUL":
      mailContent = `
      <div>
        <h1>Rainbow</h1>
        <p>Hello, ${user.givenName}! 
          Your password was succesfully changed! 
        </p>
        <p>
          With respect, Rainbow development team.
        </p>
      </div>`;
      mailSubject = `Password reset | Rainbow`;
      responseMessage = ``;
      break;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yTo4ka13@gmail.com",
      pass: "100500qwE",
    },
  });

  const mailOptions = {
    from: "Rainbow",
    to: user.email,
    subject: mailSubject,
    html: mailContent,
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
        message: responseMessage,
      });
      done(mailResult);
    }
  });
};

module.exports = mailer;
