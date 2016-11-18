import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )
}
