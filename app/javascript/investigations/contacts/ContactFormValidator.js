import moment from 'moment'
import {dateTimeFormatter} from 'utils/dateFormatter'

class ContactValidator {
  constructor(contact) {
    this.contact = contact
  }

  validate() {
    const {
      started_at,
      communication_method,
      location,
      status,
      purpose,
      investigation_started_at,
    } = this.contact
    const fields = ['started_at', 'communication_method', 'location', 'status', 'purpose']
    const errors = fields.reduce(
      (errors, field) => ({...errors, [field]: []}), {}
    )

    if (!started_at) {
      errors.started_at.push('Please enter a contact date')
    }

    const now = moment().toISOString()
    if (started_at > now) {
      errors.started_at.push('The date and time cannot be in the future')
    }

    if (investigation_started_at && started_at < investigation_started_at) {
      errors.started_at.push(
        `The contact date/time must be after the investigation start date of ${dateTimeFormatter(investigation_started_at)}`
      )
    }

    if (!communication_method) {
      errors.communication_method.push('Please enter the communication method')
    }

    if (!location) {
      errors.location.push('Please enter the contact location')
    }

    if (!status) {
      errors.status.push('Please enter a contact status')
    }

    if (!purpose) {
      errors.purpose.push('Please enter a contact purpose')
    }

    return errors
  }
}

export default ContactValidator
