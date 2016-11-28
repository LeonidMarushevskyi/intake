import React from 'react'
import {shallow} from 'enzyme'
import SelectField from 'components/common/SelectField'

describe('SelectField', () => {
  let component
  let onChange = jasmine.createSpy('onChange')
  beforeEach(() => {
    const props = {
      wrapperClassName: 'myWrapperTest',
      labelClassName: 'myLabelTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      value: 'this-is-my-value',
      onChange: onChange,
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

  it('calls onChange when a change event occurs on select field', () => {
    const selectElement = component.find('select')
    selectElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })
})
