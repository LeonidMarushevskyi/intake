import ContactValidator from 'investigations/contacts/ContactValidator'
import moment from 'moment'

describe('ContactValidator', () => {
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
