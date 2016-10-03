import React from 'react'
import ScreeningDecisionFilter from 'ScreeningDecisionFilter'
import {render, mount, shallow} from 'enzyme'

describe('ScreeningDecisionFilter', () => {
  describe('render', () => {
    it('renders Screening Decisions', () => {
      const view = render(<ScreeningDecisionFilter />)
      expect(view.text()).toContain('Decision')
      expect(view.text()).toContain('Evaluate Out')
      expect(view.text()).toContain('Accept for Investigation')
      expect(view.text()).toContain('Referral to Other Agency')
    })

    it('renders selected filters', () => {
      const selected = ['evaluate_out', 'referral_to_other_agency']
      const view = render(<ScreeningDecisionFilter selected={selected} />)
      expect(view.find('input')[0].attribs.checked).toBeDefined()
      expect(view.find('input')[1].attribs.checked).not.toBeDefined()
      expect(view.find('input')[2].attribs.checked).toBeDefined()
    })

    it('calls onChange with updated filters', () => {
      const onChangeSpy = jasmine.createSpy('onChange')
      const view = shallow(<ScreeningDecisionFilter selected={[]} onChange={onChangeSpy}/>)
      const uncheckedInput = view.find('#screening-decision-evaluate_out')
      uncheckedInput.simulate('change', {target: {checked: true}})
      expect(onChangeSpy).toHaveBeenCalledWith(['evaluate_out'])
    })
  })
})
