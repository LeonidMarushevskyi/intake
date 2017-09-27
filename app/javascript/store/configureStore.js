import createSagaMiddleware from 'redux-saga'
import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {initSagas} from 'initSagas'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {createStore, applyMiddleware} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import {routerHistory} from 'common/history'

function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer, /* preloadedState, */
    initialState,
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, thunk, routerMiddleware(routerHistory))
    )
  )
  initSagas(sagaMiddleware)
  return store
}

export const store = configureStore()
