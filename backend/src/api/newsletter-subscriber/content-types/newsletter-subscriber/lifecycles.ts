import { notify } from '../../../../utils/notify';

export default {
  async afterCreate(event: { result: { email?: string } }) {
    await notify(
      'New newsletter subscriber',
      `${event.result.email} signed up via the portfolio newsletter form.`
    );
  },
};
