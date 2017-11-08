import {resetFieldValues, setField} from 'actions/workerSafetyFormActions'
import {isFSA} from 'flux-standard-action'

describe('workerSafetyFormActions', () => {
  it('resetFieldValues is FSA compliant', () => {
    expect(isFSA(resetFieldValues({safety_alerts: [], safety_information: ''}))).toBe(true)
  })
  it('setField is FSA compliant', () => {
    expect(isFSA(setField('field', 'value'))).toBe(true)
  })
})
