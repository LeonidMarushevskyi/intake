import React from 'react'
import {mount, shallow} from 'enzyme'
import InputField from 'components/common/InputField'

describe('InputField', () => {
  let component
  let formField
  const onChange = jasmine.createSpy('onChange')
  const onBlur = jasmine.createSpy('onBlur')
  const props = {
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    id: 'myInputFieldId',
    label: 'this is my label',
    placeholder: 'This is some placeholder text...',
    onChange: onChange,
    onBlur: onBlur,
    value: 'this is my field value',
  }
  beforeEach(() => {
    component = shallow(<InputField {...props}/>)
    formField = component.find('FormField')
  })

  it('passes props to the FormField', () => {
    expect(formField.props().labelClassName).toEqual('myLabelTest')
    expect(formField.props().gridClassName).toEqual('myWrapperTest')
    expect(formField.props().id).toEqual('myInputFieldId')
    expect(formField.props().label).toEqual('this is my label')
    expect(formField.childAt(0).node.type).toEqual('input')
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
      <InputField {...props} type='tel'/>
    ).find('input')

    expect(inputElement.props().type).toEqual('text')
    expect(inputElementWithType.props().type).toEqual('tel')
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

  describe('when mask is NOT passed in', () => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
    }

    beforeEach(() => {
      component = shallow(<InputField {...props}/>)
    })
    it('renders an input field', () => {
      const maskedInput = component.find('MaskedInput')
      expect(maskedInput.length).toEqual(0)
    })
  })

  describe('when mask is passed WITHOUT placeholder props', () => {
    let blurSpy

    beforeEach(() => {
      blurSpy = jasmine.createSpy('onBlur')
      const propsWithMaskedInput = {
        gridClassName: 'myWrapperTest',
        labelClassName: 'myLabelTest',
        id: 'myInputFieldId',
        label: 'this is my label',
        onBlur: blurSpy,
        onChange: onChange,
        mask: '111-11-1111',
      }

      component = mount(<InputField {...propsWithMaskedInput}/>)
    })

    it('renders a MaskedInput field', () => {
      const inputElement = component.find('MaskedInput')
      expect(inputElement.props().mask).toEqual('111-11-1111')
      expect(inputElement.props().placeholder).toEqual(undefined)
    })

    it('calls onBlur when a blur event occurs on input field', () => {
      const inputElement = component.find('MaskedInput')
      const event = {target: {value: null}}
      inputElement.props().onBlur(event)
      expect(blurSpy).toHaveBeenCalled()
    })
  })

  describe('when mask is passed WITH placeholder props', () => {
    beforeEach(() => {
      const propsWithMaskedInput = {
        gridClassName: 'myWrapperTest',
        labelClassName: 'myLabelTest',
        id: 'myInputFieldId',
        label: 'this is my label',
        onChange: onChange,
        mask: '111-11-1111',
        blurPlaceholder: 'I feel lonely :( ',
        focusPlaceholder: 'I like attention :) ',
      }
      component = shallow(<InputField {...propsWithMaskedInput}/>)
    })

    it('assigns placeholder props properly', () => {
      const inputElement = component.find('MaskedInput')
      const event = {target: {placeholder: null}}

      expect(inputElement.props().mask).toEqual('111-11-1111')
      inputElement.props().onBlur(event)
      expect(event.target.placeholder).toEqual('I feel lonely :( ')
      inputElement.props().onFocus(event)
      expect(event.target.placeholder).toEqual('I like attention :) ')
    })
  })

  describe('when InputField is NOT required', () => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
    }

    beforeEach(() => {
      component = shallow(<InputField {...props}/>)
    })
    it('renders an input field', () => {
      expect(component.find('label.required').exists()).toEqual(false)
      expect(component.find('FormField').props().required).toEqual(undefined)
    })
  })

  describe('when InputField is required', () => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
      required: true,
    }

    beforeEach(() => {
      component = shallow(<InputField {...props}/>)
    })
    it('renders a required input field', () => {
      expect(component.find('FormField').props().required).toEqual(true)
      expect(component.find('input').prop('required')).toEqual(true)
      expect(component.find('input').prop('aria-required')).toEqual(true)
    })
  })

  describe('when MaskedInput is required', () => {
    const propsWithMaskedInput = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
      mask: '111-11-1111',
      required: true,
    }

    beforeEach(() => {
      component = shallow(<InputField {...propsWithMaskedInput}/>)
    })
    it('renders a required MaskedInput field', () => {
      expect(component.find('FormField').props().required).toEqual(true)
      expect(component.find('MaskedInput').prop('required')).toEqual(true)
      expect(component.find('MaskedInput').prop('aria-required')).toEqual(true)
      expect(component.find('MaskedInput').props().mask).toEqual('111-11-1111')
    })
  })
})
