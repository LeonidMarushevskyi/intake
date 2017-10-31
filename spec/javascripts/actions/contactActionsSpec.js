import * as actions from 'actions/contactActions'
import {isFSA} from 'flux-standard-action'

describe('contactActions', () => {
  const actionNames = Object.keys(actions)
  const actionFuncs = actionNames.filter((actionName) => (
    typeof (actions[actionName]) === 'function'
  ))
  actionFuncs.forEach((actionName) => {
    it(`${actionName} is FSA compliant`, () => {
      const action = actions[actionName]
      expect(isFSA(action({}, {}))).toEqual(true)
    })
  })
})
