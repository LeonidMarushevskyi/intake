import * as sagas from 'sagas'

export const initSagas = (sagaMiddleware) => (
  // Replacing this statement because firefox 45 does not understand Object.values
  // Object.values(sagas) == Object.keys(sagas).map(e => sagas[e])
  Object.keys(sagas).map((e) => sagas[e]).forEach(sagaMiddleware.run.bind(sagaMiddleware))
)
