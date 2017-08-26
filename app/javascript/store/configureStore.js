import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  return createStore(
    rootReducer, /* preloadedState, */
    initialState,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, thunk)
    )
  )
}
