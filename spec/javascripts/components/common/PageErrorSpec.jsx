import React from 'react'
import {shallow} from 'enzyme'
import PageError from 'common/PageError'

describe('PageError', () => {
  let component
  describe('when no params are passed', () => {
    beforeEach(() => {
      component = shallow(<PageError />)
    })
    it('renders the div wrapper', () => {
      expect(component.find('div.page-error').exists()).toEqual(true)
    })
    it('does render the generic message', () => {
      expect(component.text()).toContain('Something went wrong, sorry! Please try your last action again.')
    })
  })

  describe('when pageErrorMessage is passed', () => {
    beforeEach(() => {
      const pageErrorMessage = 'pageErrorMessage'
      component = shallow(<PageError pageErrorMessage={pageErrorMessage} />)
    })
    it('does render pageErrorMessage', () => {
      expect(component.text()).toContain('pageErrorMessage')
    })
  })
})
