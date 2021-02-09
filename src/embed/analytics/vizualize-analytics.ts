import { Order } from "./order";

export default class Analytics {
  private apiUrl: string;

  constructor(public token: string) {
    this.apiUrl = process.env.apiUrl;
  }

  sendOrder(order: Order): void {
    const payload: Order = Object.assign({}, order);

    // Validations
    const errors = [];
    if (!payload.customer)      errors.push('customer is required.');
    else {
      if (!payload.customer.first_name) errors.push('customer.first_name is required.');
      if (!payload.customer.last_name)  errors.push('customer.last_name is required.');
      if (!payload.customer.email)      errors.push('customer.email is required.');
    }
    if (!payload.items) {
      errors.push('items array is required.');
    } else {
      payload.items.forEach((item, index) => {
        if (!item.sku)          errors.push('items[' + index + '].sku is required.');
        if (!item.name)         errors.push('items[' + index + '].name is required.');
        if (!item.description)  errors.push('items[' + index + '].description is required.');
        if (!item.images)       errors.push('items[' + index + '].images array is required with at least one image url.');
        // if (item.scheduledDeliveryDate) {
        //   item.scheduledDeliveryDate = toUTCUnixTimestamp(item.scheduledDeliveryDate);
        // }
      });
    }

    if (errors.length) {
      console.groupCollapsed('Vizualize sendOrder errors');
      errors.forEach(err => {
        console.error(err);
      });
      console.groupEnd();
      return;
    }

    // Try to convert order timestamp toa Unix timestamp (seconds)
    if (!payload.timestamp) {
      payload.timestamp = new Date().getTime();
    }
    payload.timestamp = toUTCUnixTimestamp(payload.timestamp as any);

    // multiply by -1 because offset sign is opposite for javascript
    payload.customer.timezone_offset = new Date().getTimezoneOffset() * -1;

    fetch(this.apiUrl + '/w/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  }
}

/**
 * Converts the input to a unix timestamp number
 * @param {string|Date} input
 * @returns {number} Unix timestamp
 */
function toUTCUnixTimestamp(input: Date | string) {
  let result: number = null;
  if (typeof input == 'string') {
    input = new Date(input);
  }
  if (input instanceof Date && !!input.getTime()) {
    result = (input.getTime() / 1000 | 0);
  }
  return result;
}

// module.exports = function(api_key: string) {
//   return new Analytics(api_key);
// }