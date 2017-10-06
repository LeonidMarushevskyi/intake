import ContactValidator from 'investigations/contacts/ContactFormValidator'
import moment from 'moment'

describe('ContactFormValidator', () => {
  describe('started_at', () => {
    it('returns an object with an empty array for started_at when no errors are present', () => {
      const yesterday = moment().subtract(1, 'days').toISOString()
      const contact = {started_at: yesterday}
      expect(new ContactValidator(contact).validate().started_at)
        .toEqual([])
    })

    it('returns an error if started_at is missing from the contact', () => {
      const contact = {}
      expect(new ContactValidator(contact).validate().started_at)
        .toEqual(['Please enter a contact date'])
    })

    it('returns an error if started_at is an empty string', () => {
      const contact = {started_at: ''}
      expect(new ContactValidator(contact).validate().started_at)
        .toEqual(['Please enter a contact date'])
    })

    it('returns an error if started_at is a date in the future', () => {
      const tomorrow = moment().add(1, 'days').toISOString()
      const contact = {started_at: tomorrow}
      expect(new ContactValidator(contact).validate().started_at)
        .toEqual(['The date and time cannot be in the future'])
    })

    it('returns an error if started_at is before the investigation date', () => {
      const contact = {
        started_at: '2017-10-04T21:10:00.012',
        investigation_started_at: '2017-10-05T21:10:00.000',
      }
      expect(new ContactValidator(contact).validate().started_at)
        .toEqual(['The contact date/time must be after the investigation start date of 10/05/2017 9:10 PM'])
    })

    it('returns an error if communication_method is missing from the contact', () => {
      const contact = {}
      expect(new ContactValidator(contact).validate().communication_method)
        .toEqual(['Please enter the communication method'])
    })

    it('returns an error if location is missing from the contact', () => {
      const contact = {}
      expect(new ContactValidator(contact).validate().location)
        .toEqual(['Please enter the contact location'])
    })

    it('returns an error if status is missing from the contact', () => {
      const contact = {}
      expect(new ContactValidator(contact).validate().status)
        .toEqual(['Please enter a contact status'])
    })

    it('returns an error if purpose is missing from the contact', () => {
      const contact = {}
      expect(new ContactValidator(contact).validate().purpose)
        .toEqual(['Please enter a contact purpose'])
    })
  })
})
