import React from 'react'
import PersonNewPage from 'PersonNewPage'
import {mount, shallow} from 'enzyme';

describe('PersonNewPage', () => {
  describe('render', () => {
    it('renders the person input fields', () => {
      const wrapper = shallow(<PersonNewPage />)
      expect(wrapper.find('input').length).toEqual(8)
    })

    it('renders the person select fields', () => {
      const wrapper = shallow(<PersonNewPage />)
      expect(wrapper.find('select').length).toEqual(2)
    })
  })
})

