import {List} from 'immutable'
export const findByCategory = (statusCodes = List(), selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)

export const findByCode = (statusCodes, selectedCode) => (
  statusCodes.find(({code}) => code === selectedCode) || {}
)

export const buildSelector = (...funcs) => (
  (arg) => {
    var selector = funcs.pop()
    return selector(...(funcs.map((f) => (f(arg)))))
  }
)
