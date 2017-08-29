import React from 'react'
import {shallow} from 'enzyme'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

describe('ScreeningCardHeader', () => {
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy('onEdit')
  })

  function renderComponent({title = 'My Title', showEdit = true}) {
    const props = {title, showEdit, onEdit}
    return shallow(<ScreeningCardHeader {...props} />)
  }

  it('displays the title passed in the props', () => {
    const component = renderComponent({title: 'My Screening Card'})
    expect(component.text()).toContain('My Screening Card')
  })

  it('displays the edit button if the card is editable', () => {
    const component = renderComponent({showEdit: true})
    expect(component.find('EditLink').exists()).toEqual(true)
  })

  it('uses the lowercase card title in the aria label', () => {
    const component = renderComponent({showEdit: true, title: 'My Screening Card'})
    const editLink = component.find('EditLink')
    expect(editLink.props().ariaLabel).toEqual('Edit my screening card')
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
})
