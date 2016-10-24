import React from 'react'
import {shallow} from 'enzyme'
import ParticipantList from 'ParticipantList'

describe('<ParticipantList />', () => {
  it('renders a list of participant cards', () => {
    const participants = [
      {id: 1, first_name: 'Bart', last_name: 'Simpson'},
      {id: 3, first_name: 'Lisa', last_name: 'Simpson'},
    ]
    const wrapper = shallow(<ParticipantList participants={participants} />)
    expect(wrapper.find('.card-header').length).toBe(2)
    expect(wrapper.find('input').length).toBe(2)
    expect(wrapper.text()).toContain('Bart Simpson')
    expect(wrapper.text()).toContain('Lisa Simpson')
  })
})
