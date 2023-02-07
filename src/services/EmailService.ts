import { createTransport } from "nodemailer";

async function sendAccountActivationMail(receiver: string, token: string) {
  const transport = createTransport({
    host: "localhost",
    port: 8587,
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mail = await transport.sendMail({
    from: "john.doe@domain.com",
    to: receiver,
    subject: "Nodemailer stub works!",
    html: `Token is ${token}`,
  });
  return mail;
}

export default { sendAccountActivationMail };
