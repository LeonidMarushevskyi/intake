import React from 'react'
import {shallow} from 'enzyme'
import SelectField from 'common/SelectField'

describe('SelectField', () => {
  let component
  let formField
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
      <SelectField {...props}><option/></SelectField>, {disableLifecycleMethods: true}
    )
    formField = component.find('FormField')
  })

  it('passes props to the FormField', () => {
    expect(formField.props().labelClassName).toEqual('myLabelTest')
    expect(formField.props().gridClassName).toEqual('myWrapperTest')
    expect(formField.props().htmlFor).toEqual('myDateFieldId')
    expect(formField.props().label).toEqual('this is my label')
    expect(formField.childAt(0).getElement().type).toEqual('select')
  })

  it('renders the select element and children', () => {
    const selectElement = component.find('select')
    expect(selectElement.length).toEqual(1)
    expect(selectElement.props().value).toEqual('this-is-my-value')
    expect(selectElement.find('option').length).toEqual(1)
  })

  it('renders the select element value with empty string when value is null', () => {
    const propsWithNullValue = Object.assign(props, {value: null})
    component = shallow(<SelectField {...propsWithNullValue}/>, {disableLifecycleMethods: true})
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
    expect(formField.props().required).toEqual(undefined)
    expect(component.find('select').prop('required')).toEqual(undefined)
    expect(component.find('select').prop('aria-required')).toEqual(undefined)
  })

  it('renders a required select field, when required is true ', () => {
    const propsWithRequired = Object.assign(props, {required: true})
    component = shallow(<SelectField {...propsWithRequired}/>)
    expect(component.find('FormField').props().required).toEqual(true)
    expect(component.dive().find('select').prop('required')).toEqual(true)
    expect(component.dive().find('select').prop('aria-required')).toEqual(true)
  })

  it('renders a disabled select field when disabled prop is passed', () => {
    component = shallow(<SelectField {...props} disabled/>)
    expect(component.find('select').is('[disabled]')).toEqual(true)
  })
  it('renders an enabled select field when disabled prop is not passed', () => {
    component = shallow(<SelectField {...props}/>)
    expect(component.find('select').is('[disabled]')).toEqual(false)
  })
})
