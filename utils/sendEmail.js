import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, { ACCOUNT_EMAIL } from "../config/nodemailer.js";


export const sendReminderEmail = async ({to, type, subscription}) => {
    if (!to || !type) throw new Error('Email not sent. Missing required parameters');
    const template = emailTemplates.find(t => t.label === type);

    if (!template) throw new Error(`Email not sent. Invalid template type: ${type}`);

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        to: to,
        subject: subject,
        html: message,
        from: ACCOUNT_EMAIL
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Message sent: %s', info.response);
    });
}

