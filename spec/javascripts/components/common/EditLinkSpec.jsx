import React from 'react'
import EditLink from 'common/EditLink'
import {shallow} from 'enzyme'

describe('EditLink', () => {
  describe('render', () => {
    it('renders the aria label', () => {
      const component = shallow(<EditLink ariaLabel='test me' onClick={() => null} />)
      expect(component.props()['aria-label']).toEqual('test me')
    })

    it('calls onClick when the link is clicked', () => {
      const onClick = jasmine.createSpy()
      const component = shallow(<EditLink ariaLabel='test me' onClick={onClick} />)
      component.simulate('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})
