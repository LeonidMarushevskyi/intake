import React from 'react'
import {shallow} from 'enzyme'
import MaskedInputField from 'common/MaskedInputField'

describe('MaskedInputField', () => {
  const renderMaskedInputField = ({
    id = 'myMaskedInput',
    label = 'myInputLabel',
    onChange = () => {},
    ...args
  }) => {
    const props = {id, label, onChange, ...args}
    return shallow(<MaskedInputField {...props} />)
  }

  describe('without placeholder props', () => {
    it('passes props to the FormField', () => {
      const component = renderMaskedInputField({
        gridClassName: 'myWrapperTest',
        labelClassName: 'myLabelTest',
        id: 'myInputFieldId',
        label: 'this is my label',
        errors: [],
        required: false,
      })
      const formField = component.find('FormField')
      expect(formField.props().labelClassName).toEqual('myLabelTest')
      expect(formField.props().gridClassName).toEqual('myWrapperTest')
      expect(formField.props().htmlFor).toEqual('myInputFieldId')
      expect(formField.props().label).toEqual('this is my label')
      expect(formField.props().errors).toEqual([])
      expect(formField.props().required).toEqual(false)
      expect(component.find('MaskedInput').exists()).toEqual(true)
    })

    it('renders a MaskedInput field', () => {
      const component = renderMaskedInputField({mask: '111-11-1111'})
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.props().mask).toEqual('111-11-1111')
      expect(maskedInput.props().placeholder).toEqual('')
    })

    it('renders the input value', () => {
      const component = renderMaskedInputField({value: 'this is my field value'})
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.props().value).toEqual('this is my field value')
    })

    it('defaults the type to text', () => {
      const component = renderMaskedInputField({})
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.props().type).toEqual('text')
    })

    it('renders the specified input type if one is passed', () => {
      const component = renderMaskedInputField({type: 'tel'})
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.props().type).toEqual('tel')
    })

    it('calls onChange when a change event occurs on input field', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderMaskedInputField({onChange})
      const maskedInput = component.find('MaskedInput')
      maskedInput.simulate('change', {target: {value: '1234'}})
      expect(onChange).toHaveBeenCalledWith({target: {value: '1234'}})
    })

    it('calls onBlur when a blur event occurs on input field', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = renderMaskedInputField({onBlur, id: 'myInputFieldId'})
      const maskedInput = component.find('MaskedInput')
      maskedInput.simulate('blur', {target: {value: '1234'}})
      expect(onBlur).toHaveBeenCalledWith('myInputFieldId', '1234')
    })
  })

  describe('with placeholder props', () => {
    let component
    let event
    let maskedInput
    beforeEach(() => {
      event = {target: {placeholder: null}}
      component = renderMaskedInputField({placeholder: '111'})
      maskedInput = component.find('MaskedInput')
    })

    it('initiates MaskedInput with no placeholder', () => {
      expect(maskedInput.props().placeholder).toEqual('')
    })

    describe('onBlur', () => {
      it('sets the placeholder to empty string', () => {
        maskedInput.simulate('blur', event)
        expect(event.target.placeholder).toEqual('')
      })
    })

    describe('onFocus', () => {
      it('resets the placeholder', () => {
        maskedInput.simulate('focus', event)
        expect(event.target.placeholder).toEqual('111')
      })
    })
  })

  describe('when it is not required', () => {
    it('renders an input field', () => {
      const component = renderMaskedInputField({required: false})
      expect(component.find('label.required').exists()).toEqual(false)
      expect(component.find('FormField').props().required).toEqual(false)
    })
  })

  describe('when it is required', () => {
    it('renders a required MaskedInput field', () => {
      const component = renderMaskedInputField({required: true})
      const maskedInput = component.find('MaskedInput')
      expect(component.find('FormField').props().required).toEqual(true)
      expect(maskedInput.prop('required')).toEqual(true)
      expect(maskedInput.prop('aria-required')).toEqual(true)
    })
  })
})

