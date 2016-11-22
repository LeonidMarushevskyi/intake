import Immutable from 'immutable'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipanShowView', () => {
  let component
  let onEdit
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 200,
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
    })
    onEdit = jasmine.createSpy()
    component = shallow(<ParticipantShowView participant={participant} onEdit={onEdit}/>)
  })

  it('renders a participant show view card', () => {
    expect(component.find('.card.show').length).toEqual(1)
    expect(component.find('#participants-card-200').length).toEqual(1)
  })

  it('renders the participants first and last name', () => {
    expect(component.find('.card-header').text()).toContain('Kevin McCallister')
  })

  it('renders the delete link', () => {
    expect(component.find('.fa-times').length).toEqual(1)
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit participant')
  })

  it('renders the default avatar', () => {
    expect(component.find('img').props().src).toEqual('/assets/default-profile.svg')
  })

  it('renders the labels of the participant card', () => {
    expect(component.find('label').length).toEqual(4)
    expect(component.find('label').map((element) => element.text())).toEqual([
      'Name',
      'Gender',
      'Date of birth',
      'Social security number',
    ])
  })

  it('renders the participant value fields', () => {
    expect(component.find('.card-body').text()).toContain('Kevin McCallister')
    expect(component.find('.card-body').text()).toContain('Male')
    expect(component.find('.card-body').text()).toContain('11/16/1990')
    expect(component.find('.card-body').text()).toContain('111223333')
  })

  it('calls the onEdit function when edit link is clicked', () => {
    component.find('EditLink').simulate('click')
    expect(onEdit).toHaveBeenCalled()
  })
})
