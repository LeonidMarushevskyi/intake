import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import InputField from 'common/InputField'

describe('InputField', () => {
  let component
  let formField
  let onChange
  let onBlur

  const props = {
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    id: 'myInputFieldId',
    label: 'this is my label',
    placeholder: 'This is some placeholder text...',
    value: 'this is my field value',
    errors: Immutable.Map(),
    required: false,
    maxLength: '125',
    disabled: false,
  }

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onBlur = jasmine.createSpy('onBlur')
  })

  describe('basic functionality', () => {
    beforeEach(() => {
      component = shallow(<InputField {...props} onChange={onChange} onBlur={onBlur} />)
      formField = component.find('FormField')
    })

    it('passes props to the FormField', () => {
      expect(formField.props().labelClassName).toEqual('myLabelTest')
      expect(formField.props().gridClassName).toEqual('myWrapperTest')
      expect(formField.props().id).toEqual('myInputFieldId')
      expect(formField.props().label).toEqual('this is my label')
      expect(formField.props().errors).toEqual(Immutable.Map())
      expect(formField.props().required).toEqual(false)
      expect(formField.childAt(0).node.type).toEqual('input')
      expect(formField.props().disabled).toEqual(false)
    })

    it('renders the input placeholder', () => {
      const inputElement = component.find('input')
      expect(inputElement.props().placeholder).toEqual('This is some placeholder text...')
    })

    it('renders the input value', () => {
      const inputElement = component.find('input')
      expect(inputElement.props().value).toEqual('this is my field value')
    })

    it('renders the input type', () => {
      const inputElement = component.find('input')
      const inputElementWithType = shallow(
        <InputField {...props} type='tel' onChange={onChange} onBlur={onBlur}/>
      ).find('input')

      expect(inputElement.props().type).toEqual('text')
      expect(inputElementWithType.props().type).toEqual('tel')
    })

    it('renders the input length', () => {
      const inputElement = component.find('input')
      expect(inputElement.props().maxLength).toEqual('125')
    })

    it('calls onChange when a change event occurs on input field', () => {
      const inputElement = component.find('input')
      inputElement.simulate('change')
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onBlur when a blur event occurs on input field', () => {
      const inputElement = component.find('input')
      inputElement.simulate('blur')
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('when it is NOT required', () => {
    beforeEach(() => {
      component = shallow(<InputField {...props} onChange={onChange} onBlur={onBlur} />)
    })

    it('renders an input field', () => {
      expect(component.find('label.required').exists()).toEqual(false)
      expect(component.find('FormField').props().required).toEqual(false)
    })
  })

  describe('when it is required', () => {
    beforeEach(() => {
      component = shallow(<InputField {...props} onChange={onChange} onBlur={onBlur} required/>)
    })

    it('renders a required input field', () => {
      expect(component.find('FormField').props().required).toEqual(true)
      expect(component.find('input').prop('required')).toEqual(true)
      expect(component.find('input').prop('aria-required')).toEqual(true)
    })
  })

  describe('when it is disabled', () => {
    beforeEach(() => {
      component = shallow(<InputField {...props} onChange={onChange} onBlur={onBlur} disabled/>)
    })

    it('renders a disabled input field', () => {
      expect(component.find('FormField').props().disabled).toEqual(true)
      expect(component.find('input').prop('disabled')).toEqual(true)
    })
  })
})
