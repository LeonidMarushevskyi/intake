import React from 'react'
import {shallow} from 'enzyme'
import PageError from 'common/PageError'
import {Map} from 'immutable'

describe('ErrorMessages', () => {
  let component

  describe('when errors are passed', () => {
    const props = Map({
      why: 'had a bad plan but stuck to it :(',
    })

    beforeEach(() => {
      component = shallow(<PageError messageObject={props}/>)
    })

    it('Expand/collapse button changes class', () => {
      expect(component.find('.page-error.collapsed').exists()).toEqual(true)
      expect(component.find('.page-error.expanded').exists()).toEqual(false)
      component.find('button').simulate('click')
      expect(component.find('.page-error.collapsed').exists()).toEqual(false)
      expect(component.find('.page-error.expanded').exists()).toEqual(true)
      component.find('button').simulate('click')
      expect(component.find('.page-error.collapsed').exists()).toEqual(true)
      expect(component.find('.page-error.expanded').exists()).toEqual(false)
    })

    it('renders the div wrapper', () => {
      expect(component.find('div.page-error').exists()).toEqual(true)
    })

    it('renders the response JSON', () => {
      expect(component.text()).toContain('why: had a bad plan but stuck to it :(')
    })
  })
})
