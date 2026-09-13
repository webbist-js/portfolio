import { notify } from '../../../../utils/notify';

export default {
  async afterCreate(event: { result: { name?: string; email?: string; message?: string } }) {
    const { name, email, message } = event.result;
    await notify(
      `New enquiry from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\n${message}\n\n— sent from the portfolio contact form`
    );
  },
};
