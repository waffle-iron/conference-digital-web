module.exports = {
  'title': {
    notEmpty: {
      errorMessage: 'You must provide a title'
    },
    isLength: {
      options: [{ max: 100 }],
      errorMessage: 'Must be between 2 and 100 chars long'
    },
    errorMessage: 'Invalid title'
  },
  'description': {
    notEmpty: {
      errorMessage: 'You must provide a description'
    },
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 255 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid description'
  },
  'address_1': {
    notEmpty: true,
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 255 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  },
  'address_2': {
    optional: true,
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 255 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  },
  'town': {
    optional: true,
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  },
  'county': {
    optional: true,
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 255 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  },
  'zipcode': {
    notEmpty: true,
    isLength: {
      options: [{ max: 255 }],
      errorMessage: 'Must be between 2 and 255 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  },
  'country': {
    notEmpty: true,
    isLength: {
      options: [{ max: 20 }],
      errorMessage: 'Must be between 2 and 20 chars long' // Error message for the validator, takes precedent over parameter message
    },
    errorMessage: 'Invalid address'
  }
}
