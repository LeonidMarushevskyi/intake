import React from 'react'
import ServerErrorPage from 'errors/ServerErrorPage'
import {shallow} from 'enzyme'

describe('ServerErrorPage', () => {
  let component

  beforeEach(() => {
    component = shallow(<ServerErrorPage/>)
  })

  it('renders the error text', () => {
    expect(component.text()).toContain('Sorry, something went wrong.')
    expect(component.text()).toContain(
      "It's nothing you did. Due to an entirely internal error, your request could not be completed. Please try refreshing the page."
    )
  })
})
