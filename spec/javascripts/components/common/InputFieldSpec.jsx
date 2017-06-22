import React from 'react'
import Immutable from 'immutable'
import {mount, shallow} from 'enzyme'
import InputField from 'components/common/InputField'

describe('InputField', () => {
  let component
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
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myInputFieldId')
    expect(component.find('label').props().htmlFor).toEqual('myInputFieldId')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(labelElement.html()).toContain('<label class="myLabelTest"')
    expect(labelElement.text()).toEqual('this is my label')
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
      expect(component.find('label').not('.required').exists()).toEqual(true)
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
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('label').not('.required').exists()).toEqual(false)
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
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('label').not('.required').exists()).toEqual(false)
      expect(component.find('MaskedInput').prop('required')).toEqual(true)
      expect(component.find('MaskedInput').prop('aria-required')).toEqual(true)
      expect(component.find('MaskedInput').props().mask).toEqual('111-11-1111')
    })
  })

  describe('when no errors passed', () => {
    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('renders ErrorMessages but with no errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(undefined)
    })
  })

  describe('when an empty list is passed for errors', () => {
    const propsWithEmptyErrors = {
      ...props,
      errors: Immutable.List(),
    }

    beforeEach(() => {
      component = shallow(<InputField {...propsWithEmptyErrors}/>)
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('renders ErrorMessages and pass it an empty list of errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(Immutable.List())
    })
  })

  describe('when errors are passed', () => {
    const propsWithErrorMessages = {
      errors: Immutable.List(['Please enter an assigned worker.', 'You have failed this city!']),
      fieldKey: 'inputFieldName',
      gridClassName: 'myWrapperTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      labelClassName: 'myLabelTest',
      onChange: onChange,
      validationRules: {inputFieldName: 'required'},
    }
    beforeEach(() => {
      component = shallow(<InputField {...propsWithErrorMessages}/>)
    })

    it('adds an error class to the input wrapper', () => {
      expect(component.find('.input-error').length).toEqual(1)
    })

    it('displays an error styled label', () => {
      expect(component.find('.input-error-label').length).toEqual(1)
    })

    it('displays error messages', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors)
        .toEqual(Immutable.List(['Please enter an assigned worker.', 'You have failed this city!']))
    })
  })
})
