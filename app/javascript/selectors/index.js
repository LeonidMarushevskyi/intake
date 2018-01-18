import {List} from 'immutable'
export const findByCategory = (statusCodes = List(), selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)

export const buildSelector = (...funcs) => (
  (arg) => {
    var selector = funcs.pop()
    return selector(...(funcs.map((f) => (f(arg)))))
  }
)
