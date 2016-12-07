import React from 'react'
import {shallow} from 'enzyme'
import PhoneNumberField from 'components/common/PhoneNumberField'

describe('PhoneNumberField', () => {
  let component
  let onChange = jasmine.createSpy('onChange')
  const props = {
    Number: '222-222-2222',
    Type: 'Work',
    onChange: onChange,
  }
  beforeEach(() => {
    component = shallow(<PhoneNumberField {...props}/>)
  })

  it('renders the phone number field', () => {
    expect(component.find('InputField').props().value).toEqual('222-222-2222')
    expect(component.find('InputField').props().type).toEqual('tel')
    expect(component.find('InputField').props().placeholder).toEqual('Ex: 910-435-3223')
    expect(component.find('InputField').props().label).toEqual('Phone Number')
  })

  it('renders the phone number type field', () => {
    expect(component.find('SelectField').props().value).toEqual('Work')
    expect(component.find('SelectField').props().label).toEqual('Phone Number Type')
  })

  it('calls onChange when phone number field has changed', () => {
    component.find('InputField').simulate('change', {target: {value: '333-333-3333'}})
    expect(onChange).toHaveBeenCalledWith('number', '333-333-3333')
  })

  it('calls onChange when phone number type field has changed', () => {
    component.find('SelectField').simulate('change', {target: {value: 'Home'}})
    expect(onChange).toHaveBeenCalledWith('type', 'Home')
  })
})
