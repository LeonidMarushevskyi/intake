import React from 'react'
import {shallow} from 'enzyme'
import InputField from 'common/InputField'

describe('InputField', () => {
  let component
  let formField
  let onChange
  let onBlur

  const props = {
    disabled: false,
    errors: [],
    gridClassName: 'myWrapperTest',
    id: 'myInputFieldId',
    label: 'this is my label',
    labelClassName: 'myLabelTest',
    maxLength: '125',
    placeholder: 'This is some placeholder text...',
    required: false,
    value: 'this is my field value',
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
      expect(formField.props().htmlFor).toEqual('myInputFieldId')
      expect(formField.props().label).toEqual('this is my label')
      expect(formField.props().errors).toEqual([])
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
      inputElement.simulate('change', {target: {value: 'hola mundo'}})
      expect(onChange).toHaveBeenCalledWith({target: {value: 'hola mundo'}})
    })

    it('sanitizes the call to onChange when an allowCharacters pattern is given', () => {
      component.setProps({allowCharacters: /[a-zA-Z\s-]/})
      const inputElement = component.find('input')
      inputElement.simulate('change', {target: {value: 'hola mu-ndo239847%^#@$?'}})
      expect(onChange).toHaveBeenCalledWith({target: {value: 'hola mu-ndo'}})
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
