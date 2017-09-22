export const getScreening = (state) => state.get('screening')
export const findByCategory = (statusCodes = [], selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)

export const findInPersonCommunicationMethod = (state) => {
  const communicationMethods = state.get('communicationMethods')
  if (communicationMethods) {
    return communicationMethods.find((method) => method.get('value') === 'In person')
  } else {
    return undefined
  }
}
