import dayjs from "dayjs";
import {createRequire} from "module";
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/sendEmail.js";
const require = createRequire(import.meta.url);

const {serve} = require('@upstash/workflow/express')

const REMINDERS = [7,5,3,1]

export const sendReminder = serve(async (context) => {
  const {subscriptionId} = context.requestPayload;
  //console.log(`Sending reminder for subscription ${subscriptionId}`)
  const subscription = await fetchSubscription(context, subscriptionId);
  //console.log(subscription)
  if (!subscription || subscription.status !== 'active') return;
  const renewalDate = dayjs(subscription.renewalDate);
  
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Subscription ${subscription.name} is expired`)
    return;
  }

  for (const days of REMINDERS) {
    const reminderDate = dayjs(renewalDate).subtract(days, 'days');
    if (reminderDate.isAfter(dayjs())) {
        await sleepUntilReminder(context, `Reminder ${subscription.name} in ${days} days`, reminderDate);
    }
    
    if (dayjs().isSame(reminderDate, 'day')) {
        await triggerReminder(context, `${days} days before reminder`, subscription);
    }
  }

})

const fetchSubscription = async (context,subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} on ${date}`)
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Sending ${label} reminder`)
        // send email
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription: subscription
        })
    })
}