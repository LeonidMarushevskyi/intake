import PersonDemographicsFormContainer from 'containers/screenings/PersonDemographicsFormContainer'
import React from 'react'
import {createMockStore} from 'redux-test-utils'
import {fromJS} from 'immutable'
import * as peopleActions from 'actions/peopleFormActions'
import {shallow} from 'enzyme'

describe('PersonDemographicsFormContainer', () => {
  const state = fromJS({
    participants: [{id: '1', ssn: '123456789', approximate_age: '9', approximate_age_units: 'dog years',
      date_of_birth: '2014-01-15', languages: ['Javascript', 'Ruby'], gender: 'female',
      roles: ['super-hero', 'anti-hero'], first_name: 'John', middle_name: 'Q', last_name: 'Public',
      legacy_descriptor: {legacy_ui_id: '1-4', legacy_table_description: 'Client'},
      races: [{race: 'White', race_detail: 'Romanian'}, {race: 'Asian', race_detail: 'Chinese'}],
      ethnicity: {hispanic_latino_origin: 'Yes', ethnicity_detail: ['Mexican']},
    }]})
  const store = createMockStore(state)
  let component
  beforeEach(() => {
    const context = {store}
    component = shallow(<PersonDemographicsFormContainer personId='1'/>, {context})
  })
  it('renders PersonDemographicsForm', () => {
    expect(component.find('PersonDemographicsForm').props()).toEqual({
      approximateAge: undefined,
      approximateAgeUnit: 'years',
      approximateAgeIsDisabled: true,
      approximateAgeUnitOptions: [
        {label: 'Days', value: 'days'},
        {label: 'Weeks', value: 'weeks'},
        {label: 'Months', value: 'months'},
        {label: 'Years', value: 'years'},
      ],
      dateOfBirth: '2014-01-15',
      gender: 'female',
      genderOptions: [
        {label: '', value: ''},
        {label: 'Male', value: 'male'},
        {label: 'Female', value: 'female'},
        {label: 'Unknown', value: 'unknown'},
      ],
      languageOptions: jasmine.any(Array),
      languages: ['Javascript', 'Ruby'],
      onChange: jasmine.any(Function),
      personId: '1',
    })
  })
  describe('onChange', () => {
    it('calls setField with a max of 2 languages', () => {
      const setFieldSpy = spyOn(peopleActions, 'setField')
      component.find('PersonDemographicsForm').props().onChange('languages', [
        {label: 'Omega', value: 'Ω'},
        {label: 'Beta', value: 'ß'},
        {label: 'Alpha', value: '∂'},
        {label: 'Delta', value: '∆'},
      ])
      expect(setFieldSpy).toHaveBeenCalledWith('1', ['languages'], ['Ω', 'ß'])
    })

    it('calls setField with passed value if field is not languages', () => {
      const setFieldSpy = spyOn(peopleActions, 'setField')
      component.find('PersonDemographicsForm').props().onChange('gender', 'male')
      expect(setFieldSpy).toHaveBeenCalledWith('1', ['gender'], 'male')
    })
  })
})
