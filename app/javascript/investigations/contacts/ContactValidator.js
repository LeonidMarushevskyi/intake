import _ from 'lodash'
import moment from 'moment'

class ContactValidator {
  constructor(contact) {
    this.contact = contact
  }

  validate() {
    const contact = this.contact
    const errors = {
      started_at: [],
    }

    if (_.isEmpty(contact.started_at)) {
      errors.started_at.push('Please enter a contact date')
    }

    const now = moment().toISOString()
    if (contact.started_at > now) {
      errors.started_at.push('The date and time cannot be in the future.')
    }

    return errors
  }
}

export default ContactValidator
