import {fromJS, List} from 'immutable'
import {getContactLogsSelector} from 'selectors/contactLogSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('contactLogSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getContactLogsSelector', () => {
    it("returns contact 'legacy id' as id", () => {
      const investigation = {
        contacts: [
          {legacy_descriptor: {legacy_id: 'legacy_id_1'}},
          {legacy_descriptor: {legacy_id: 'legacy_id_2'}},
        ],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'id'])).toEqual('legacy_id_1')
      expect(contacts.getIn([1, 'id'])).toEqual('legacy_id_2')
    })

    it('returns investigation id', () => {
      const investigation = {
        legacy_descriptor: {
          legacy_id: 'existing_investigation_id',
        },
        contacts: [{}, {}],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'investigationId'])).toEqual(
        'existing_investigation_id'
      )
      expect(contacts.getIn([1, 'investigationId'])).toEqual(
        'existing_investigation_id'
      )
    })

    it("returns contact 'people' as a list of formatted names", () => {
      const investigation = {
        contacts: [{
          people: [
            {first_name: 'Joan', middle_name: 'Lee', last_name: 'Karrah'},
          ],
        }, {
          people: [
            {first_name: 'Michael', last_name: 'Londe'},
            {first_name: 'Keneth'},
          ],
        }],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'people'])).toEqualImmutable(
        List(['Joan Lee Karrah'])
      )
      expect(contacts.getIn([1, 'people'])).toEqualImmutable(
        List(['Michael Londe', 'Keneth (Unknown last name)'])
      )
    })

    it("returns contact 'started_at' as a formatted startedAt datetime", () => {
      const investigation = {
        contacts: [{
          started_at: '',
        }, {
          started_at: '2017-01-26T10:00:00.000Z',
        }],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'startedAt'])).toEqual('')
      expect(contacts.getIn([1, 'startedAt'])).toEqual('01/26/2017 3:00 AM')
    })

    it("returns contact 'status' as the contact status value", () => {
      const contactStatuses = [
        {code: 'CONTACT_STATUS_CODE_1', value: 'Status code 1'},
        {code: 'CONTACT_STATUS_CODE_2', value: 'Status code 2'},
      ]
      const investigation = {
        contacts: [
          {status: 'CONTACT_STATUS_CODE_1'},
          {status: 'CONTACT_STATUS_CODE_2'},
          {status: null},
        ],
      }
      const state = fromJS({investigation, contactStatuses})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'status'])).toEqual('Status code 1')
      expect(contacts.getIn([1, 'status'])).toEqual('Status code 2')
      expect(contacts.getIn([2, 'status'])).toEqual(undefined)
    })

    it("returns contact 'method' as the communication method value", () => {
      const communicationMethods = [
        {code: 'COMMUNICATION_METHOD_CODE_1', value: 'Method code 1'},
        {code: 'COMMUNICATION_METHOD_CODE_2', value: 'Method code 2'},
      ]
      const investigation = {
        contacts: [
          {communication_method: 'COMMUNICATION_METHOD_CODE_1'},
          {communication_method: 'COMMUNICATION_METHOD_CODE_2'},
          {communication_method: null},
        ],
      }
      const state = fromJS({investigation, communicationMethods})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'method'])).toEqual('Method code 1')
      expect(contacts.getIn([1, 'method'])).toEqual('Method code 2')
      expect(contacts.getIn([2, 'method'])).toEqual(undefined)
    })

    it('returns contact note', () => {
      const investigation = {
        contacts: [
          {note: 'A sample note 1'},
          {note: 'A sample note 2'},
        ],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'note'])).toEqual('A sample note 1')
      expect(contacts.getIn([1, 'note'])).toEqual('A sample note 2')
    })

    it('sorts contacts in chronological order by started_at', () => {
      const investigation = {
        contacts: [
          {legacy_descriptor: {legacy_id: 'legacy_id_1'}, started_at: '2010-04-27T23:30:14.001Z'},
          {legacy_descriptor: {legacy_id: 'legacy_id_2'}, started_at: '2010-04-27T23:30:14.000Z'},
        ],
      }
      const state = fromJS({investigation})
      const contacts = getContactLogsSelector(state)
      expect(contacts.getIn([0, 'id'])).toEqual('legacy_id_2')
      expect(contacts.getIn([1, 'id'])).toEqual('legacy_id_1')
    })
  })
})

