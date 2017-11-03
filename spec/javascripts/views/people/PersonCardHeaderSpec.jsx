import React from 'react'
import {shallow} from 'enzyme'
import PersonCardHeader from 'views/people/PersonCardHeader'

describe('PersonCardHeader', () => {
  let onDelete
  let onEdit

  beforeEach(() => {
    onDelete = jasmine.createSpy('onDelete')
    onEdit = jasmine.createSpy('onEdit')
  })

  function renderComponent({title = 'J Doe', showEdit = true, showDelete = true, informationFlag = null}) {
    const props = {informationFlag, title, showDelete, showEdit, onEdit, onDelete}
    return shallow(<PersonCardHeader {...props} />)
  }

  it('displays the name passed in the props', () => {
    const component = renderComponent({title: 'Alex'})
    expect(component.text()).toContain('Alex')
  })

  describe('participant flag', () => {
    it('does not render a flag element if no flag is present', () => {
      const component = renderComponent({informationFlag: null})
      const informationFlag = component.find('span').filter('.information-flag')
      expect(informationFlag.exists()).toEqual(false)
    })

    it('displays the flag if one is passed', () => {
      const component = renderComponent({informationFlag: 'Sensitive'})
      const informationFlag = component.find('span').filter('.information-flag')
      expect(informationFlag.exists()).toEqual(true)
      expect(informationFlag.text()).toEqual('Sensitive')
    })
  })

  describe('edit button', () => {
    it('displays if the card is editable', () => {
      const component = renderComponent({showEdit: true})
      expect(component.find('EditLink').exists()).toEqual(true)
    })

    it('calls the onEdit function from the props when clicked', () => {
      const component = renderComponent({showEdit: true})
      const event = jasmine.createSpyObj('event', ['preventDefault'])
      const editLink = component.find('EditLink')
      editLink.simulate('click', event)
      expect(onEdit).toHaveBeenCalled()
    })

    it('does not render if the card is not editable', () => {
      const component = renderComponent({showEdit: false})
      expect(component.find('EditLink').exists()).toEqual(false)
    })
  })

  describe('delete button', () => {
    it('displays if showDelete is true', () => {
      const component = renderComponent({showDelete: true})
      const deleteButton = component.find('button[aria-label="Delete person"]')
      expect(deleteButton.exists()).toEqual(true)
    })

    it('calls the onDelete function from the props when clicked', () => {
      const component = renderComponent({showEdit: true})
      const deleteButton = component.find('button[aria-label="Delete person"]')
      deleteButton.simulate('click')
      expect(onDelete).toHaveBeenCalled()
    })

    it('displays if showDelete is false', () => {
      const component = renderComponent({showDelete: false})
      const deleteButton = component.find('button[aria-label="Delete person"]')
      expect(deleteButton.exists()).toEqual(false)
    })
  })
})
