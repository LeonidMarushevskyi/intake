import {fromJS} from 'immutable'

const initialState = fromJS({})

export default function errorsReducer(state = initialState, action) {
  const {payload, error, type} = action
  if (error) {
    switch (type) {
      // eslint-disable-next-line no-case-declarations
      default:
        return state.set(type, fromJS(payload))
    }
  } else {
    return state.delete(type)
  }
}
