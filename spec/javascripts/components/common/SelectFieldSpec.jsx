import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import SelectField from 'components/common/SelectField'

describe('SelectField', () => {
  let component
  let fieldLabel
  const props = {
    children: [],
    gridClassName: 'myWrapperTest',
    labelClassName: 'myLabelTest',
    id: 'myDateFieldId',
    label: 'this is my label',
    value: 'this-is-my-value',
  }
  let onChange
  let onBlur
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onBlur = jasmine.createSpy('onBlur')
    props.onChange = onChange
    props.onBlur = onBlur
    component = shallow(
      <SelectField {...props}><option/></SelectField>
    )
    fieldLabel = component.find('FieldLabel')
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('select').props().id).toEqual('myDateFieldId')
    expect(fieldLabel.props().id).toEqual('myDateFieldId')
  })

  it('renders the label', () => {
    expect(fieldLabel.props().label).toEqual('this is my label')
    expect(fieldLabel.props().classes).toContain('myLabelTest')
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
    expect(fieldLabel.props().required).toBeFalsy()
    expect(component.find('select').prop('required')).toBeFalsy()
    expect(component.find('select').prop('aria-required')).toBeFalsy()
  })

  describe('when SelectField is required', () => {
    it('renders a required select field', () => {
      onChange = jasmine.createSpy('onChange')
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
      component = shallow(<SelectField {...props}/>)
      expect(component.find('FieldLabel').props().required).toEqual(true)
      expect(component.find('select').prop('required')).toEqual(true)
      expect(component.find('select').prop('aria-required')).toEqual(true)
    })
  })

  describe('when no errors passed', () => {
    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(fieldLabel.props().hasError).toBeFalsy()
    })

    it('renders ErrorMessages but with no errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(undefined)
    })
  })

  describe('when an empty list is passed for errors', () => {
    beforeEach(() => {
      const propsWithEmptyErrors = {
        ...props,
        errors: Immutable.List(),
        onChange: jasmine.createSpy('onChange'),
      }
      component = shallow(<SelectField {...propsWithEmptyErrors}/>)
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('FieldLabel').props().hasError).toBeFalsy()
    })

    it('renders ErrorMessages and pass it an empty list of errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(Immutable.List())
    })
  })

  describe('when errors are passed', () => {
    beforeEach(() => {
      const propsWithErrorMessages = {
        ...props,
        errors: Immutable.List(['Please choose wisely.', 'Stick to the plan!']),
        validationRules: {inputFieldName: 'required'},
        onChange: jasmine.createSpy('onChange'),
      }
      component = shallow(<SelectField {...propsWithErrorMessages}/>)
    })

    it('adds an error class to the input wrapper', () => {
      expect(component.find('.input-error').length).toEqual(1)
    })

    it('displays an error styled label', () => {
      expect(component.find('FieldLabel').props().hasError).toEqual(true)
    })

    it('renders ErrorMessages and pass it errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(Immutable.List(['Please choose wisely.', 'Stick to the plan!']))
    })
  })
})
