import React from 'react'
import {shallow} from 'enzyme'
import AutocompleterInvolvedPeopleList from 'AutocompleterInvolvedPeopleList'

describe('<AutcompleterInvolvedPeopleList />', () => {
  it('renders a Autosuggest component', () => {
    const involvedPeople = [
      {first_name: 'Bart', last_name: 'Simpson'},
      {first_name: 'Lisa', last_name: 'Simpson'}
    ]
    const wrapper = shallow(
      <AutocompleterInvolvedPeopleList involvedPeople={involvedPeople} />
    )
    expect(wrapper.find('li').length).toBe(2)
    expect(wrapper.find('input').length).toBe(2)
    expect(wrapper.text()).toContain('Bart Simpson')
    expect(wrapper.text()).toContain('Lisa Simpson')
  })
})
