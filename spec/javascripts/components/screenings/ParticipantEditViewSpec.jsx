import Immutable from 'immutable'
import ParticipantEditView from 'components/screenings/ParticipantEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantEditView', () => {
  let component
  const onCancel = jasmine.createSpy('onCancel')
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })
    component = shallow(<ParticipantEditView participant={participant} onCancel={onCancel}/>)
  })

  it('renders a participant edit view card', () => {
    expect(component.find('.card.edit').length).toEqual(1)
    expect(component.find('#participants-card-199').length).toEqual(1)
  })

  it('renders the participants first and last name in the card header', () => {
    expect(component.find('.card-header').text()).toContain('Lisa Simpson')
  })

  it('renders the participant header correctly when first name is null', () => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: null,
      last_name: 'Simpson',
    })
    component = shallow(<ParticipantEditView participant={participant} />)
    expect(component.find('.card-header span').text()).toEqual('(Unknown first name) Simpson')
  })

  it('renders the participant header correctly when last name is null', () => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: 'Lisa',
      last_name: null,
    })
    component = shallow(<ParticipantEditView participant={participant} />)
    expect(component.find('.card-header span').text()).toEqual('Lisa (Unknown last name)')
  })

  it('renders the participant header correctly when first and last names are null', () => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: null,
      last_name: null,
    })
    component = shallow(<ParticipantEditView participant={participant} />)
    expect(component.find('.card-header span').text()).toEqual('Unknown person')
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

  it('when user hits cancel', () => {
    const cancelButton = component.find('button[children="Cancel"]')
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls the onDelete function when delete link is clicked', () => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })

    const onDelete = jasmine.createSpy('onDelete')

    component = shallow(<ParticipantEditView participant={participant} onDelete={onDelete}/>)
    component.find('.delete-button').simulate('click')
    expect(onDelete).toHaveBeenCalled()
  })
})

describe('addresses ', () => {
  const component = shallow(<ParticipantEditView participant={Immutable.fromJS({})} />)
  it('renders a address edit view', () => {
    expect(component.find('AddressesEditView').length).toEqual(1)
  })
})
