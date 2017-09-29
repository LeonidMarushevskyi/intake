import {List} from 'immutable'
export const findByCategory = (statusCodes = List(), selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)
