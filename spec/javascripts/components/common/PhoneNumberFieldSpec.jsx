import React from 'react'
import {shallow} from 'enzyme'
import PhoneNumberField from 'common/PhoneNumberField'

describe('PhoneNumberField', () => {
  let component
  const onChange = jasmine.createSpy('onChange')
  const props = {
    Number: '222-222-2222',
    Type: 'Work',
    onChange: onChange,
  }
  beforeEach(() => {
    component = shallow(<PhoneNumberField {...props}/>)
  })

  it('renders the phone number field', () => {
    const numberField = component.find('MaskedInputField')
    expect(numberField.props().value).toEqual('222-222-2222')
    expect(numberField.props().mask).toEqual('(111)111-1111')
    expect(numberField.props().type).toEqual('tel')
    expect(numberField.props().placeholder).toEqual('(___)___-____')
    expect(numberField.props().label).toEqual('Phone Number')
    expect(numberField.props().maxLength).toEqual('13')
  })

  it('renders the phone number type field', () => {
    expect(component.find('SelectField').props().value).toEqual('Work')
    expect(component.find('SelectField').props().label).toEqual('Phone Number Type')
  })

  it('calls onChange when phone number field has changed', () => {
    component.find('MaskedInputField').simulate('change', {target: {value: '333-333-3333'}})
    expect(onChange).toHaveBeenCalledWith('number', '333-333-3333')
  })

  it('calls onChange when phone number type field has changed', () => {
    component.find('SelectField').simulate('change', {target: {value: 'Home'}})
    expect(onChange).toHaveBeenCalledWith('type', 'Home')
  })
})
