import React from 'react'
import {shallow} from 'enzyme'
import MaskedInputField from 'common/MaskedInputField'

describe('MaskedInputField', () => {
  let component
  let formField
  let maskedInput
  let onChange
  let onBlur
  let props

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onBlur = jasmine.createSpy('onBlur')
    props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
      onBlur: onBlur,
      value: 'this is my field value',
      mask: '111-11-1111',
      errors: [],
      required: false,
    }
  })

  describe('without placeholder props', () => {
    beforeEach(() => {
      component = shallow(<MaskedInputField {...props} />)
      formField = component.find('FormField')
      maskedInput = component.find('MaskedInput')
    })

    it('passes props to the FormField', () => {
      expect(formField.props().labelClassName).toEqual('myLabelTest')
      expect(formField.props().gridClassName).toEqual('myWrapperTest')
      expect(formField.props().htmlFor).toEqual('myInputFieldId')
      expect(formField.props().label).toEqual('this is my label')
      expect(formField.props().errors).toEqual([])
      expect(formField.props().required).toEqual(false)
      expect(maskedInput.exists()).toEqual(true)
    })

    it('renders a MaskedInput field', () => {
      expect(maskedInput.props().mask).toEqual('111-11-1111')
      expect(maskedInput.props().placeholder).toEqual('')
    })

    it('renders the input value', () => {
      expect(maskedInput.props().value).toEqual('this is my field value')
    })

    it('renders the input type', () => {
      const maskedInputWithType = shallow(
        <MaskedInputField {...props} type='tel'/>
      ).find('MaskedInput')

      expect(maskedInput.props().type).toEqual('text')
      expect(maskedInputWithType.props().type).toEqual('tel')
    })

    it('calls onChange when a change event occurs on input field', () => {
      maskedInput.simulate('change')
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onBlur when a blur event occurs on input field', () => {
      maskedInput.simulate('blur', {target: {value: '1234'}})
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('with placeholder props', () => {
    let event
    let maskedInput
    beforeEach(() => {
      event = {target: {placeholder: null}}
      component = shallow(<MaskedInputField {...props} placeholder={'111'}/>)
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
      component = shallow(<MaskedInputField {...props}/>)
      expect(component.find('label.required').exists()).toEqual(false)
      expect(component.find('FormField').props().required).toEqual(false)
    })
  })

  describe('when it is required', () => {
    it('renders a required MaskedInput field', () => {
      component = shallow(<MaskedInputField {...props} required />)
      maskedInput = component.find('MaskedInput')
      expect(component.find('FormField').props().required).toEqual(true)
      expect(maskedInput.prop('required')).toEqual(true)
      expect(maskedInput.prop('aria-required')).toEqual(true)
      expect(maskedInput.props().mask).toEqual('111-11-1111')
    })
  })
})

