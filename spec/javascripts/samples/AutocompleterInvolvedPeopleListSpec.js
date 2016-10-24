import React from 'react'
import {shallow} from 'enzyme'
import AutocompleterParticipantsList from 'AutocompleterParticipantsList'

describe('<AutocompleterParticipantsList />', () => {
  it('renders a Autosuggest component', () => {
    const participants = [
      {first_name: 'Bart', last_name: 'Simpson'},
      {first_name: 'Lisa', last_name: 'Simpson'},
    ]
    const wrapper = shallow(
      <AutocompleterParticipantsList participants={participants} />
    )
    expect(wrapper.find('li').length).toBe(2)
    expect(wrapper.find('input').length).toBe(2)
    expect(wrapper.text()).toContain('Bart Simpson')
    expect(wrapper.text()).toContain('Lisa Simpson')
  })
})
