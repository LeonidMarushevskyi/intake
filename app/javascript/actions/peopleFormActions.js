export const SET_PEOPLE_FORM_FIELD = 'SET_PEOPLE_FORM_FIELD'
export const ADD_PEOPLE_FORM_PHONE_NUMBER = 'ADD_PEOPLE_FORM_PHONE_NUMBER'
export const DELETE_PEOPLE_FORM_PHONE_NUMBER = 'DELETE_PEOPLE_FORM_PHONE_NUMBER'
export const setField = (personId, fieldSet, value) => ({
  type: SET_PEOPLE_FORM_FIELD,
  payload: {personId, fieldSet, value},
})
export const addPhone = (personId) => ({type: ADD_PEOPLE_FORM_PHONE_NUMBER, payload: {personId}})
export const deletePhone = (personId, phoneIndex) => ({type: DELETE_PEOPLE_FORM_PHONE_NUMBER, payload: {personId, phoneIndex}})
