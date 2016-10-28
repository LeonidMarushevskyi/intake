import React from 'react'
import CheckboxListFilter from 'components/common/CheckboxListFilter'
import ScreeningDecision from 'ScreeningDecision'
import {render, shallow} from 'enzyme'

describe('CheckboxListFilter', () => {
  describe('render', () => {
    it('displays the legend', () => {
      const view = render(<CheckboxListFilter collection={{}} legend={'Decision'}/>)
      expect(view.text()).toContain('Decision')
    })

    it('displays the collection', () => {
      const view = render(<CheckboxListFilter collection={ScreeningDecision}/>)
      expect(view.text()).toContain('Evaluate Out')
      expect(view.text()).toContain('Accept for Investigation')
      expect(view.text()).toContain('Referral to Other Agency')
    })

    it('displays selected filters', () => {
      const selected = ['evaluate_out', 'referral_to_other_agency']
      const view = render(
        <CheckboxListFilter collection={ScreeningDecision} selected={selected} name={'screening-decision'}/>
      )
      expect(view.find('input#screening-decision-evaluate_out')[0].attribs.checked).toBeDefined()
      expect(view.find('input#screening-decision-accept_for_investigation')[0].attribs.checked).not.toBeDefined()
      expect(view.find('input#screening-decision-referral_to_other_agency')[0].attribs.checked).toBeDefined()
    })

    it('calls onChange with updated filters', () => {
      const onChangeSpy = jasmine.createSpy('onChange')
      const view = shallow(<CheckboxListFilter collection={ScreeningDecision} selected={[]} onChange={onChangeSpy}/>)
      const uncheckedInput = view.find('#checkbox-filter-evaluate_out')
      uncheckedInput.simulate('change', {target: {checked: true}})
      expect(onChangeSpy).toHaveBeenCalledWith(['evaluate_out'])
    })
  })
})
