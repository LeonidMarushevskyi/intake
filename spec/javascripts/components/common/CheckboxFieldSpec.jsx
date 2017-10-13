import React from 'react'
import {shallow} from 'enzyme'
import CheckboxField from 'common/CheckboxField'

describe('CheckboxField', () => {
  let onChange
  let onBlur
  let component
  const props = {
    errors: [],
    id: 'myCheckboxFieldId',
    value: 'this-is-my-value',
  }
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onBlur = jasmine.createSpy('onBlur')
    props.onChange = onChange
    props.onBlur = onBlur
    component = shallow(<CheckboxField {...props} />)
  })

  it('passes ariaDescribedBy to the ErrorMessages', () => {
    expect(component.find('ErrorMessages').props().ariaDescribedBy).toEqual('myCheckboxFieldId')
  })

  it('passes errors to the ErrorMessages', () => {
    expect(component.find('ErrorMessages').props().errors).toEqual([])
  })

  describe('with no flags set', () => {
    it('renders the id', () => {
      expect(component.find('input').props().id).toEqual('myCheckboxFieldId')
      expect(component.find('label[htmlFor="myCheckboxFieldId"]').exists()).toEqual(true)
    })

    it('renders the value', () => {
      expect(component.find('input').props().value).toEqual('this-is-my-value')
      expect(component.find('label').text()).toEqual('this-is-my-value')
    })

    it('renders with NO checked prop', () => {
      expect(component.find('input').props().checked).toEqual(undefined)
    })

    it('renders with NO disable prop', () => {
      expect(component.find('input').props().disabled).toEqual(undefined)
    })

    it('renders with NO required prop', () => {
      expect(component.find('label.required').exists()).toEqual(false)
      expect(component.find('input').prop('required')).toEqual(undefined)
      expect(component.find('input').prop('aria-required')).toEqual(undefined)
    })
  })

  it('calls onChange when a change event occurs on checkbox field', () => {
    const selectElement = component.find('input')
    selectElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onBlur when a blur event occurs on checkbox field', () => {
    const selectElement = component.find('input')
    selectElement.simulate('blur')
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when flag props are set', () => {
    it('renders with required prop', () => {
      component = shallow(<CheckboxField {...props} required/>)
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('input').prop('required')).toEqual(true)
      expect(component.find('input').prop('aria-required')).toEqual(true)
    })

    it('renders with disable prop', () => {
      component = shallow(<CheckboxField {...props} disabled/>)
      expect(component.find('input').props().disabled).toEqual(true)
    })

    it('renders with checked prop', () => {
      component = shallow(<CheckboxField {...props} checked/>)
      expect(component.find('input').props().checked).toEqual(true)
    })
  })
})
