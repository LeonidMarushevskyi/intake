import createSagaMiddleware from 'redux-saga'
import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {initSagas} from 'initSagas'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {createStore, applyMiddleware} from 'redux'

function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer, /* preloadedState, */
    initialState,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, thunk)
    )
  )
  initSagas(sagaMiddleware)
  return store
}

export const store = configureStore()
