import Immutable from 'immutable'
import ParticipantEditView from 'components/screenings/ParticipantEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantEditView', () => {
  let component
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 199,
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })
    component = shallow(<ParticipantEditView participant={participant} />)
  })

  it('renders a participant edit view card', () => {
    expect(component.find('.card.edit').length).toEqual(1)
    expect(component.find('#participants-card-199').length).toEqual(1)
  })

  it('renders the participants first and last name in the card header', () => {
    expect(component.find('.card-header').text()).toContain('Lisa Simpson')
  })

  it('renders the delete link', () => {
    expect(component.find('.fa-times').length).toEqual(1)
  })

  it('renders the input fields', () => {
    expect(component.find('InputField[label="First Name"]').props().value)
      .toEqual('Lisa')
    expect(component.find('InputField[label="Last Name"]').props().value)
      .toEqual('Simpson')
    expect(component.find('DateField[label="Date of birth"]').props().value)
      .toEqual('2016-12-31')
    expect(component.find('SelectField[label="Gender"]').props().value)
      .toEqual('female')
    expect(component.find('InputField[label="Social security number"]').props().value)
      .toEqual('ssn-1')
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })
})

describe('ParticipantEditView on null values', () => {
  let component
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 199,
      first_name: 'Lisa',
      last_name: null,
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })
    component = shallow(<ParticipantEditView participant={participant} />)
  })

  it('renders the participant header corectly with null last name', () => {
    expect(component.find('.card-header').text()).not.toContain('null')
  })
})
