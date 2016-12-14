import React from 'react'
import {shallow} from 'enzyme'
import DateField from 'components/common/DateField'

describe('DateField', () => {
  let component
  const onChange = jasmine.createSpy('onChange')
  beforeEach(() => {
    const props = {
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

  it('calls onChange when a change event occurs on input field', () => {
    const inputElement = component.find('input')
    inputElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })
})
