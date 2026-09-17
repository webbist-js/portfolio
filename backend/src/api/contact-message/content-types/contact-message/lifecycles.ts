import { notify } from '../../../../utils/notify';

export default {
  afterCreate(event: { result: { name?: string; email?: string; message?: string } }) {
    const { name, email, message } = event.result;
    // Not awaited: the entry is already stored, so holding the response open
    // for SendGrid only makes the visitor wait on someone else's latency.
    // notify() handles its own failures and never rejects.
    void notify(
      `New enquiry from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\n${message}\n\n— sent from the portfolio contact form`
    );
  },
};
