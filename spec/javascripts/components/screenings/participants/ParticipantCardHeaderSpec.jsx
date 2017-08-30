import React from 'react'
import {shallow} from 'enzyme'
import ParticipantCardHeader from 'screenings/ParticipantCardHeader'

describe('ParticipantCardHeader', () => {
  let onDelete
  let onEdit

  beforeEach(() => {
    onDelete = jasmine.createSpy('onDelete')
    onEdit = jasmine.createSpy('onEdit')
  })

  function renderComponent({title = 'J Doe', showEdit = true}) {
    const props = {title, showEdit, onEdit, onDelete}
    return shallow(<ParticipantCardHeader {...props} />)
  }

  it('displays the name passed in the props', () => {
    const component = renderComponent({title: 'Alex'})
    expect(component.text()).toContain('Alex')
  })

  it('displays the edit button if the card is editable', () => {
    const component = renderComponent({showEdit: true})
    expect(component.find('EditLink').exists()).toEqual(true)
  })

  it('uses the card title in the aria label', () => {
    const component = renderComponent({showEdit: true})
    const editLink = component.find('EditLink')
    expect(editLink.props().ariaLabel).toEqual('Edit participant')
  })

  it('calls the onEdit function from the props when the edit button is clicked', () => {
    const component = renderComponent({showEdit: true})
    const event = jasmine.createSpyObj('event', ['preventDefault'])
    const editLink = component.find('EditLink')
    editLink.simulate('click', event)
    expect(onEdit).toHaveBeenCalled()
  })

  it('does not render the edit button if the card is not editable', () => {
    const component = renderComponent({showEdit: false})
    expect(component.find('EditLink').exists()).toEqual(false)
  })

  it('calls the onDelete function from the props when the delete button is clicked', () => {
    const component = renderComponent({showEdit: true})
    const deleteButton = component.find('button')
    deleteButton.simulate('click')
    expect(onDelete).toHaveBeenCalled()
  })
})
