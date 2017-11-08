export const SET_PEOPLE_FORM_FIELD = 'SET_PEOPLE_FORM_FIELD'
export const setField = (personId, fieldSet, value) => ({
  type: SET_PEOPLE_FORM_FIELD,
  payload: {personId, fieldSet, value},
})
