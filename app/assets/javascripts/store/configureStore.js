import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'

export default function configureStore(initialState) {
  return createStore(
    rootReducer, /* preloadedState, */
    initialState,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  )
}
