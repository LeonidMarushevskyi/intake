import {Map} from 'immutable'

export const getScreeningSelector = (state) => (state.get('screening') || Map())
