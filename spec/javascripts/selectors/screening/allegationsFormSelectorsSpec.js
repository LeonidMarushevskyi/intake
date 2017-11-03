import {fromJS} from 'immutable'
import {
  getFormattedAllegationsSelector,
} from 'selectors/screening/allegationsFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('allegationsFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFormattedAllegations', () => {
    it('combines victims and perpetrators from the store', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
      ]
      const state = fromJS({participants})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([{
        victimName: 'John Smith',
        victimId: '1',
        perpetratorName: 'Jane Doe',
        perpetratorId: '2',
        allegationTypes: [],
      }]))
    })

    it('only includes the victim name in the first allegation for that victim', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
        {id: '3', first_name: 'Bob', last_name: 'Smith', roles: ['Perpetrator']},
      ]
      const state = fromJS({participants})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([
        {
          victimName: 'John Smith',
          victimId: '1',
          perpetratorName: 'Jane Doe',
          perpetratorId: '2',
          allegationTypes: [],
        }, {
          victimName: '',
          victimId: '1',
          perpetratorName: 'Bob Smith',
          perpetratorId: '3',
          allegationTypes: [],
        },
      ]))
    })

    it('includes any allegationsTypes from the store for that victim and perpetrator', () => {
      const participants = [
        {id: '1', first_name: 'John', last_name: 'Smith', roles: ['Victim']},
        {id: '2', first_name: 'Jane', last_name: 'Doe', roles: ['Perpetrator']},
      ]
      const allegationsForm = [
        {victimId: '1', perpetratorId: '2', allegationTypes: ['General neglect']},
      ]
      const state = fromJS({participants, allegationsForm})
      expect(getFormattedAllegationsSelector(state)).toEqualImmutable(fromJS([{
        victimName: 'John Smith',
        victimId: '1',
        perpetratorName: 'Jane Doe',
        perpetratorId: '2',
        allegationTypes: ['General neglect'],
      }]))
    })
  })
})
