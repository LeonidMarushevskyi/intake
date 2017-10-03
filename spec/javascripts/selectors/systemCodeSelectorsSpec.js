import {getInPersonCommunicationMethodValueSelector} from 'selectors/systemCodeSelectors'
import {fromJS} from 'immutable'

describe('getInPersonCommunicationMethodValueSelector', () => {
  it("returns the code value for 'In person' communication method", () => {
    const communicationMethods = [{code: '667', value: 'In person'}]
    const state = fromJS({communicationMethods})
    expect(getInPersonCommunicationMethodValueSelector(state)).toEqual('667')
  })

  it('returns undefined when communication methods are empty', () => {
    const state = fromJS({communicationMethods: []})
    expect(getInPersonCommunicationMethodValueSelector(state)).toEqual(undefined)
  })
})
