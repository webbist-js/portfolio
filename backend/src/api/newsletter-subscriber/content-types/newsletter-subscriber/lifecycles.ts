import { notify } from '../../../../utils/notify';

export default {
  afterCreate(event: { result: { email?: string } }) {
    // Not awaited — see the contact-message lifecycle.
    void notify(
      'New newsletter subscriber',
      `${event.result.email} signed up via the portfolio newsletter form.`
    );
  },
};
