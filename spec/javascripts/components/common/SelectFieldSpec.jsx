import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import SelectField from 'components/common/SelectField'

describe('SelectField', () => {
  let component
  let props
  const onChange = jasmine.createSpy('onChange')
  const onBlur = jasmine.createSpy('onBlur')
  beforeEach(() => {
    props = {
      children: [],
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      value: 'this-is-my-value',
      onChange: onChange,
      onBlur: onBlur,
    }
    component = shallow(
      <SelectField {...props}><option/></SelectField>
    )
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('select').props().id).toEqual('myDateFieldId')
    expect(component.find('label').props().htmlFor).toEqual('myDateFieldId')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(labelElement.html()).toContain('<label class="myLabelTest"')
    expect(labelElement.text()).toEqual('this is my label')
  })

  it('renders the select element and children', () => {
    const selectElement = component.find('select')
    expect(selectElement.length).toEqual(1)
    expect(selectElement.props().value).toEqual('this-is-my-value')
    expect(selectElement.find('option').length).toEqual(1)
  })

  it('renders the select element value with empty string when value is null', () => {
    const propsWithNullValue = Object.assign(props, {value: null})
    component = shallow(<SelectField {...propsWithNullValue}/>)
    const inputElement = component.find('select')
    expect(inputElement.length).toEqual(1)
    expect(inputElement.props().value).toEqual('')
  })

  it('calls onChange when a change event occurs on select field', () => {
    const selectElement = component.find('select')
    selectElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onBlur when a blur event occurs on select field', () => {
    const selectElement = component.find('select')
    selectElement.simulate('blur')
    expect(onBlur).toHaveBeenCalled()
  })

  it('does not render a required select field', () => {
    expect(component.find('label.required').exists()).toEqual(false)
    expect(component.find('label').not('.required').exists()).toEqual(true)
    expect(component.find('select').prop('required')).toBeFalsy()
    expect(component.find('select').prop('aria-required')).toBeFalsy()
  })

  describe('when SelectField is required', () => {
    const props = {
      children: [],
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      required: true,
      value: 'this-is-my-value',
      onChange: onChange,
    }

    beforeEach(() => {
      component = shallow(<SelectField {...props}/>)
    })
    it('renders a required select field', () => {
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('label').not('.required').exists()).toEqual(false)
      expect(component.find('select').prop('required')).toEqual(true)
      expect(component.find('select').prop('aria-required')).toEqual(true)
    })
  })

  describe('when no errors passed', () => {
    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').length).toEqual(0)
    })
  })

  describe('when an empty list is passed for errors', () => {
    const propsWithEmptyErrors = {
      ...props,
      errors: Immutable.List(),
    }

    beforeEach(() => {
      component = shallow(<SelectField {...propsWithEmptyErrors}/>)
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').length).toEqual(0)
    })
  })

  describe('when errors are passed', () => {
    const propsWithErrorMessages = {
      ...props,
      errors: Immutable.List(['Please choose wisely.', 'Stick to the plan!']),
      validationRules: {inputFieldName: 'required'},
    }
    beforeEach(() => {
      component = shallow(<SelectField {...propsWithErrorMessages}/>)
    })

    it('adds an error class to the input wrapper', () => {
      expect(component.find('.input-error').length).toEqual(1)
    })

    it('displays an error styled label', () => {
      expect(component.find('.input-error-label').length).toEqual(1)
    })

    it('displays error messages', () => {
      expect(component.find('.input-error-message').length).toEqual(2)
      expect(component.find('.input-error-message').first().text()).toEqual('Please choose wisely.')
      expect(component.find('.input-error-message').last().text()).toEqual('Stick to the plan!')
    })
  })
})
