class Analytics {
  constructor(token) {
    this.token = token;
    this.apiUrl = process.env.apiUrl;
  }

  widgetViewed(widgetId) {
    // get user info (browser user agent, session from cookie)

    // send to API
  }

  sendOrder(order) {
    let payload = Object.assign({}, order);

    // Validations
    let errors = [];
    if (!payload.customer)      errors.push('customer is required.');
    else {
      if (!payload.customer.firstName)  errors.push('customer.firstName is required.');
      if (!payload.customer.lastName)   errors.push('customer.lastName is required.');
      if (!payload.customer.email)      errors.push('customer.email is required.');
    }
    if (!payload.items)         errors.push('items array is required.');
    else {
      payload.items.forEach(function(item, index) {
        if (!item.sku)          errors.push('items[' + index + '].sku is required.');
        if (!item.name)         errors.push('items[' + index + '].name is required.');
        if (!item.description)  errors.push('items[' + index + '].description is required.');
        if (!item.images)       errors.push('items[' + index + '].images array is required with at least one image url.');
        if (item.scheduledDeliveryDate) {
          item.scheduledDeliveryDate = toUTCUnixTimestamp(item.scheduledDeliveryDate);
        }
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

    // Try to convert orderTimestamp toa Unix timestamp (seconds)
    if (!payload.orderTimestamp) {
      payload.orderTimestamp = new Date(payload.orderTimestamp);
    }
    // if (typeof payload.orderTimestamp == 'string') {
    //   payload.orderTimestamp = new Date(payload.orderTimestamp);
    // }
    // if (payload.orderTimestamp instanceof Date && !!payload.orderTimestamp.getTime()) {
    //   payload.orderTimestamp = (payload.orderTimestamp.getTime() / 1000 | 0);
    // }
    payload.orderTimestamp = toUTCUnixTimestamp(payload.orderTimestamp);

    // multiply by -1 because offset sign is opposite for javascript
    payload.customer.timezoneoffset = new Date().getTimezoneOffset() * -1;

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
function toUTCUnixTimestamp(input) {
  if (typeof input == 'string') {
    input = new Date(input);
  }
  if (input instanceof Date && !!input.getTime()) {
    input = (input.getTime() / 1000 | 0);
  }
  return input;
}

module.exports = function(apiKey) {
  return new Analytics(apiKey);
}