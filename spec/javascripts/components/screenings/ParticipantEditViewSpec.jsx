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

  it('renders the participant inputs', () => {
    expect(component.find('input').length).toEqual(4)
    expect(component.find('input').nodes.map((node) => node.props.value)).toEqual([
      'Lisa',
      'Simpson',
      '2016-12-31',
      'ssn-1',
    ])
  })

  it('renders the participant gender', () => {
    expect(component.find('select').props().value).toEqual('female')
  })

  it('renders the labels of the participant card ', () => {
    expect(component.find('label').length).toEqual(5)
    expect(component.find('label').map((element) => element.text())).toEqual([
      'First Name',
      'Last Name',
      'Date of birth',
      'Gender',
      'Social security number',
    ])
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })
})
