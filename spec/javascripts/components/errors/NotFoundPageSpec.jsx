import React from 'react'
import NotFoundPage from 'errors/NotFoundPage'
import {shallow} from 'enzyme'

describe('NotFoundPage', () => {
  let component

  beforeEach(() => {
    component = shallow(<NotFoundPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('Sorry, this is not the page you want.')
    expect(component.text()).toContain(
      "It may have been deleted or doesn't exist. Please check the address or"
    )
  })

  it('renders a link to dashboard', () => {
    expect(component.find('Link').props().to).toBe('/')
    expect(component.find('Link').props().children).toBe('return to your dashboard')
  })
})
