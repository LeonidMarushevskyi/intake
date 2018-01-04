import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
import React from 'react'
import {shallow} from 'enzyme'

describe('CreateUnknownPerson', () => {
  let component
  let onClick

  beforeEach(() => {
    onClick = jasmine.createSpy('onClick')
    component = shallow(
      <CreateUnknownPerson
        onClick={onClick}
      />
    )
  })

  it('renders the create new person button', () => {
    expect(component.find('button').text()).toContain('Create a new person')
  })

  it('calls onClick when the button is clicked', () => {
    const button = component.find('button')
    button.simulate('click')
    expect(onClick).toHaveBeenCalledWith({id: null})
    expect(onClick.calls.count()).toEqual(1)
  })
})
