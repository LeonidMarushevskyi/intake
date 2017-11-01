import * as actions from 'actions/crossReportFormActions'
import {isFSA} from 'flux-standard-action'

describe('crossReportFormActions', () => {
  const actionNames = Object.keys(actions)
  const actionFuncs = actionNames.filter((actionName) => (
    typeof (actions[actionName]) === 'function'
  ))
  actionFuncs.forEach((actionName) => {
    it(`${actionName} is FSA compliant`, () => {
      const action = actions[actionName]
      expect(isFSA(action())).toEqual(true)
    })
  })
})
