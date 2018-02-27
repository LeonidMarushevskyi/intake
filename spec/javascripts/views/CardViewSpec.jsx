import React from 'react'
import {shallow} from 'enzyme'
import CardView from 'views/CardView'

describe('Card View', () => {
  const renderCardView = ({editable = false, ...args}) => {
    const props = {editable, ...args}
    return shallow(<CardView {...props} />, {disableLifecycleMethods: true})
  }

  it('renders a card anchor', () => {
    const card = renderCardView({})
    expect(card.find('.anchor').exists()).toBe(true)
  })

  it('renders a card', () => {
    const card = renderCardView({})
    expect(card.find('.card').exists()).toEqual(true)
  })

  it('uses the id passed', () => {
    const card = renderCardView({id: 'my-card'})
    expect(card.find('#my-card').exists()).toEqual(true)
  })

  it('renders the title of the card in the header', () => {
    const card = renderCardView({title: 'My Title'})
    const title = card.find('.card-header').children('span').text()
    expect(title).toEqual('My Title')
  })

  it('displays an edit button if editable is true', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, editable: true})
    expect(component.find('EditLink').exists()).toEqual(true)
  })

  it('uses the card title for the edit link aria label', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, title: 'My Title', editable: true})
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit my title')
  })

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, editable: true})
    component.find('EditLink').simulate('click', {preventDefault: () => {}})
    expect(onEdit).toHaveBeenCalled()
  })

  it('does not display an edit button if editable is false', () => {
    const component = renderCardView({editable: false})
    expect(component.find('EditLink').exists()).toEqual(false)
  })

  describe('when mode is edit', () => {
    const mode = 'edit'
    it('adds the edit mode as a class', () => {
      const card = renderCardView({mode})
      expect(card.find('.edit').exists()).toEqual(true)
      expect(card.find('.show').exists()).toEqual(false)
    })

    it('renders the edit prop, but not the show', () => {
      const edit = <span>Edit</span>
      const show = <span>Show</span>
      const card = renderCardView({edit, mode, show})
      expect(card.text()).toContain('Edit')
      expect(card.text()).not.toContain('Show')
    })
  })

  describe('when mode is show', () => {
    const mode = 'show'

    it('adds the mode as a class', () => {
      const card = renderCardView({mode})
      expect(card.find('.show').exists()).toEqual(true)
      expect(card.find('.edit').exists()).toEqual(false)
    })

    it('renders the show prop, but not the edit', () => {
      const edit = <span>Edit</span>
      const show = <span>Show</span>
      const card = renderCardView({edit, mode, show})
      expect(card.text()).toContain('Show')
      expect(card.text()).not.toContain('Edit')
    })
  })
})
