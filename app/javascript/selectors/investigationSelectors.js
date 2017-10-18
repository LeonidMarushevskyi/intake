import {Map} from 'immutable'

export const getInvestigationSelector = (state) => state.get('investigation') || Map()
