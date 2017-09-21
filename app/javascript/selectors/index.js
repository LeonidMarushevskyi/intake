export const getScreening = (state) => state.get('screening')
export const findByCategory = (statusCodes = [], selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)
