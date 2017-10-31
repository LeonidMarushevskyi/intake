import * as actions from 'actions/contactFormActions'
import {isFSA} from 'flux-standard-action'

describe('contactFormActions', () => {
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
