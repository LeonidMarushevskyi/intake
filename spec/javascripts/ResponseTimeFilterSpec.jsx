import React from 'react'
import ResponseTimeFilter from 'ResponseTimeFilter'
import {render, mount, shallow} from 'enzyme'

describe('ResponseTimeFilter', () => {
  describe('render', () => {
    it('renders Response Times', () => {
      const view = render(<ResponseTimeFilter />)
      expect(view.text()).toContain('Response Time')
      expect(view.text()).toContain('Immediate')
      expect(view.text()).toContain('Within 24 hours')
      expect(view.text()).toContain('More than 24 hours')
    })

    it('renders selected filters', () => {
      const selected = ['immediate', 'more_than_twenty_four_hours']
      const view = render(<ResponseTimeFilter selected={selected} />)
      expect(view.find('input')[0].attribs.checked).toBeDefined()
      expect(view.find('input')[1].attribs.checked).not.toBeDefined()
      expect(view.find('input')[2].attribs.checked).toBeDefined()
    })

    it('calls onChange with updated filters', () => {
      const onChangeSpy = jasmine.createSpy('onChange')
      const view = shallow(<ResponseTimeFilter selected={[]} onChange={onChangeSpy}/>)
      const uncheckedInput = view.find('#response-time-within_twenty_four_hours')
      uncheckedInput.simulate('change', {target: {checked: true}})
      expect(onChangeSpy).toHaveBeenCalledWith(['within_twenty_four_hours'])
    })
  })
})
