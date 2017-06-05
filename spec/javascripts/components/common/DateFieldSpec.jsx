import React from 'react'
import {shallow} from 'enzyme'
import DateField from 'components/common/DateField'

describe('DateField', () => {
  let component
  let props
  const onChange = jasmine.createSpy('onChange')
  beforeEach(() => {
    props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      onChange: onChange,
      value: 'this is my field value',
    }
    component = shallow(
      <DateField {...props}/>
    )
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myDateFieldId')
    expect(component.find('label').props().htmlFor).toEqual('myDateFieldId')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(labelElement.html()).toContain('<label class="myLabelTest"')
    expect(labelElement.text()).toEqual('this is my label')
  })

  it('renders the input element', () => {
    const inputElement = component.find('input')
    expect(inputElement.length).toEqual(1)
    expect(inputElement.props().type).toEqual('date')
    expect(inputElement.props().className).toEqual('input-type-date')
    expect(inputElement.props().value).toEqual('this is my field value')
  })

  it('renders the input element with empty string when value is null', () => {
    const propsWithNullValue = Object.assign(props, {value: null})
    component = shallow(<DateField {...propsWithNullValue}/>)
    const inputElement = component.find('input')
    expect(inputElement.length).toEqual(1)
    expect(inputElement.props().value).toEqual('')
  })

  it('calls onChange when a change event occurs on input field', () => {
    const inputElement = component.find('input')
    inputElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })

  describe('when DateField is required', () => {
    const props = {
      gridClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myInputFieldId',
      label: 'this is my label',
      onChange: onChange,
      required: true,
      value: 'this is my field value',
    }

    beforeEach(() => {
      component = shallow(<DateField {...props}/>)
    })
    it('renders a required date field', () => {
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('label').not('.required').exists()).toEqual(false)
      expect(component.find('input').prop('required')).toEqual(true)
      expect(component.find('input').prop('aria-required')).toEqual(true)
    })
  })
})
