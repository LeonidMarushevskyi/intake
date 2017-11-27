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
  describe('when a count of errors is passed', () => {
    const errorCount = 12
    beforeEach(() => {
      component = shallow(<PageError errorCount={errorCount} />)
    })
    it('renders the div wrapper', () => {
      expect(component.find('div.page-error').exists()).toEqual(true)
    })
    it('does render the generic message', () => {
      expect(component.text()).toContain(`${errorCount} error(s) have been identified. Please fix them and try submitting again.`)
    })
  })
})
