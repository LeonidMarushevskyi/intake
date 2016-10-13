import PersonShowPage from 'PersonShowPage'
import React from 'react'
import {shallow} from 'enzyme';

describe('PersonShowPage', () => {
  describe('render', () => {
    it('renders the person label fields', () => {
      const wrapper = shallow(<PersonShowPage />)
      expect(wrapper.find('label').length).toEqual(9)
    })
  })
})

