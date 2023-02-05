import { createTransport } from "nodemailer";
import { stubTransport } from "nodemailer-stub";

async function sendAccountActivitationMail(receiver: string, token: string) {
  const transport = createTransport(stubTransport);
  const mail = await transport.sendMail({
    from: "john.doe@domain.com",
    to: receiver,
    subject: "Nodemailer stub works!",
    html: `Token is ${token}`,
  });
  return mail;
}

export default { sendAccountActivitationMail };
