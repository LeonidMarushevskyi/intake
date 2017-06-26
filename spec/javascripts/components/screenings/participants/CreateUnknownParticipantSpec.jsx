import CreateUnknownParticipant from 'components/screenings/CreateUnknownParticipant'
import React from 'react'
import {shallow} from 'enzyme'

describe('CreateUnknownParticipant', () => {
  let component
  let saveCallback

  beforeEach(() => {
    saveCallback = jasmine.createSpy('saveCallback')
    component = shallow(
      <CreateUnknownParticipant
        saveCallback={saveCallback}
      />
    )
  })

  it('renders the create new person button', () => {
    expect(component.find('button').text()).toContain('Create a new person')
  })

  it('calls saveCallback when the button is clicked', () => {
    const button = component.find('button')
    button.simulate('click')
    expect(saveCallback).toHaveBeenCalledWith({id: null})
    expect(saveCallback.calls.count()).toEqual(1)
  })
})
