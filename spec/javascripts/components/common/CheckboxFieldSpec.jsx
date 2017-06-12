import React from 'react'
import {shallow} from 'enzyme'
import CheckboxField from 'components/common/CheckboxField'

describe('CheckboxField', () => {
  const onChange = jasmine.createSpy('onChange')
  const props = {
    id: 'myCheckboxFieldId',
    value: 'this-is-my-value',
    onChange: onChange,
  }
  let component = shallow(<CheckboxField {...props} />)

  describe('with no flags set', () => {
    it('renders the id', () => {
      expect(component.find('input').props().id).toEqual('myCheckboxFieldId')
      expect(component.find('label').props().htmlFor).toEqual('myCheckboxFieldId')
    })

    it('renders the value', () => {
      expect(component.find('input').props().value).toEqual('this-is-my-value')
    })

    it('renders with NO checked prop', () => {
      expect(component.find('input').props().checked).toBeFalsy()
    })

    it('renders with NO disable prop', () => {
      expect(component.find('input').props().disabled).toBeFalsy()
    })

    it('renders with NO required prop', () => {
      expect(component.find('label.required').exists()).toBeFalsy()
      expect(component.find('input').prop('required')).toBeFalsy()
      expect(component.find('input').prop('aria-required')).toBeFalsy()
    })
  })

  it('calls onChange when a change event occurs on checkbox field', () => {
    component = shallow(<CheckboxField {...props} />)
    const selectElement = component.find('input')
    selectElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })

  describe('when flag props are set', () => {
    it('renders with required prop', () => {
      const propsWithRequired = {props, required: true}
      component = shallow(<CheckboxField {...propsWithRequired} />)
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('input').prop('required')).toEqual(true)
      expect(component.find('input').prop('aria-required')).toEqual(true)
    })

    it('renders with disable prop', () => {
      const propsWithDisabled = {props, disabled: true}
      component = shallow(<CheckboxField {...propsWithDisabled} />)
      expect(component.find('input').props().disabled).toEqual(true)
    })

    it('renders with checked prop', () => {
      const propsWithChecked = {props, checked: true}
      component = shallow(<CheckboxField {...propsWithChecked} />)
      expect(component.find('input').props().checked).toEqual(true)
    })
  })
})
