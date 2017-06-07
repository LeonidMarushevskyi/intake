import React from 'react'
import {shallow} from 'enzyme'
import CheckboxField from 'components/common/CheckboxField'

describe('CheckboxField', () => {
  let component
  const onChange = jasmine.createSpy('onChange')
  beforeEach(() => {
    const props = {
      id: 'myCheckboxFieldId',
      value: 'this-is-my-value',
      checked: true,
      disabled: true,
      required: true,
      onChange: onChange,
    }
    component = shallow(<CheckboxField {...props} />)
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myCheckboxFieldId')
    expect(component.find('label').props().htmlFor).toEqual('myCheckboxFieldId')
  })

  it('renders the value', () => {
    expect(component.find('input').props().value).toEqual('this-is-my-value')
  })

  it('renders the checked prop', () => {
    expect(component.find('input').props().checked).toEqual(true)
  })

  it('renders the disable prop', () => {
    expect(component.find('input').props().disabled).toEqual(true)
  })

  it('renders the required prop', () => {
    expect(component.find('label.required').exists()).toEqual(true)
    expect(component.find('input').prop('required')).toEqual(true)
    expect(component.find('input').prop('aria-required')).toEqual(true)
  })

  it('calls onChange when a change event occurs on checkbox field', () => {
    const selectElement = component.find('input')
    selectElement.simulate('change')
    expect(onChange).toHaveBeenCalled()
  })
})
