import Immutable from 'immutable'
import ParticipantShowView from 'ParticipantShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipanShowView', () => {
  let wrapper
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 200,
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
    })
    wrapper = shallow(<ParticipantShowView participant={participant} />)
  })

  it('renders a participant show view card', () => {
    expect(wrapper.find('.card.show').length).toEqual(1)
    expect(wrapper.find('#participants-card-200').length).toEqual(1)
  })

  it('renders the participants first and last name', () => {
    expect(wrapper.find('.card-header').text()).toContain('Kevin McCallister')
  })

  it('renders the delete link', () => {
    expect(wrapper.find('.fa-times').length).toEqual(1)
  })

  it('renders the edit link', () => {
    expect(wrapper.find('.fa-pencil').length).toEqual(1)
  })

  it('renders the default avatar', () => {
    expect(wrapper.find('img').props().src).toEqual('/assets/default-profile.svg')
  })

  it('renders the labels of the participant card', () => {
    expect(wrapper.find('label').length).toEqual(4)
    expect(wrapper.find('label').map((element) => element.text())).toEqual([
      'Name',
      'Gender',
      'Date of birth',
      'Social security number',
    ])
  })

  it('renders the participant value fields', () => {
    expect(wrapper.find('.card-body').text()).toContain('Kevin McCallister')
    expect(wrapper.find('.card-body').text()).toContain('Male')
    expect(wrapper.find('.card-body').text()).toContain('11/16/1990')
    expect(wrapper.find('.card-body').text()).toContain('111223333')
  })
})
