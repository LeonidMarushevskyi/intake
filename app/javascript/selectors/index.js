import {List} from 'immutable'
export const getScreening = (state) => state.get('screening')
export const findByCategory = (statusCodes = List(), selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)
