import React from 'react'
import CheckboxListFilter from 'common/CheckboxListFilter'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import {render, shallow} from 'enzyme'

describe('CheckboxListFilter', () => {
  describe('render', () => {
    it('displays the legend', () => {
      const view = render(<CheckboxListFilter collection={{}} legend={'Decision'}/>)
      expect(view.text()).toContain('Decision')
    })

    it('displays the collection', () => {
      const view = render(<CheckboxListFilter collection={SCREENING_DECISION}/>)
      expect(view.text()).toContain('Screen out')
      expect(view.text()).toContain('Differential response')
      expect(view.text()).toContain('Promote to referral')
      expect(view.text()).toContain('Information to child welfare services')
    })

    it('displays selected filters', () => {
      const selected = ['screen_out', 'differential_response']
      const view = render(
        <CheckboxListFilter collection={SCREENING_DECISION} selected={selected} name={'screening-decision'}/>
      )
      expect(view.find('input#screening-decision-screen_out')[0].attribs.checked).toBeDefined()
      expect(view.find('input#screening-decision-promote_to_referral')[0].attribs.checked).not.toBeDefined()
      expect(view.find('input#screening-decision-differential_response')[0].attribs.checked).toBeDefined()
    })

    it('calls onChange with updated filters', () => {
      const onChangeSpy = jasmine.createSpy('onChange')
      const view = shallow(<CheckboxListFilter collection={SCREENING_DECISION} selected={[]} onChange={onChangeSpy}/>)
      const uncheckedInput = view.find('#checkbox-filter-screen_out')
      uncheckedInput.simulate('change', {target: {checked: true}})
      expect(onChangeSpy).toHaveBeenCalledWith(['screen_out'])
    })
  })
})
