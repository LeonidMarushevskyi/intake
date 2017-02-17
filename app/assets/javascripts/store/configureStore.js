import rootReducer from 'reducers'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose} from 'redux'

export default function configureStore(initialState) {
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  return createStore(
    rootReducer, /* preloadedState, */
    initialState,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  )
  /* eslint-enable */
}
