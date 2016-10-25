import Immutable from 'immutable'
import ParticipantEditView from 'ParticipantEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantEditView', () => {
  let wrapper
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 199,
      first_name: 'Bart',
      last_name: 'Simpson',
    })
    wrapper = shallow(<ParticipantEditView participant={participant} />)
  })

  it('renders a participant edit view card', () => {
    expect(wrapper.find('.card.edit').length).toEqual(1)
    expect(wrapper.find('#participants-card-199').length).toEqual(1)
  })

  it('renders the participant input id', () => {
    expect(wrapper.find('input').props().value).toEqual(199)
  })

  it('renders the participants first and last name', () => {
    expect(wrapper.text()).toContain('Bart Simpson')
  })

  it('renders the delete link', () => {
    expect(wrapper.find('.fa-times').length).toEqual(1)
  })
})
