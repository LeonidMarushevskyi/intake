import * as actions from 'actions/investigationActions'
import {isFSA} from 'flux-standard-action'

describe('investigationActions', () => {
  const actionNames = Object.keys(actions)
  const actionFuncs = actionNames.filter((actionName) => (
    typeof (actions[actionName]) === 'function'
  ))
  actionFuncs.forEach((actionName) => {
    it(`${actionName} is FSA compliant`, () => {
      const action = actions[actionName]
      expect(isFSA(action({}))).toEqual(true)
    })
  })
})
