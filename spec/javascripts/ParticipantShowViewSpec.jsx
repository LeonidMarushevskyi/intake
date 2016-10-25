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
    })
    wrapper = shallow(<ParticipantShowView participant={participant} />)
  })

  it('renders a participant show view card', () => {
    expect(wrapper.find('.card.show').length).toEqual(1)
    expect(wrapper.find('#participants-card-200').length).toEqual(1)
  })

  it('renders the participants first and last name', () => {
    expect(wrapper.text()).toContain('Kevin McCallister')
  })

  it('renders the delete link', () => {
    expect(wrapper.find('.fa-times').length).toEqual(1)
  })

  it('renders the edit link', () => {
    expect(wrapper.find('.fa-pencil').length).toEqual(1)
  })
})
