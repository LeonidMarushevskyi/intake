import React from 'react'
import {shallow} from 'enzyme'
import AddressField from 'components/common/AddressField'

describe('AddressField', () => {
  let component
  let onChange = jasmine.createSpy('onChange')
  const props = {
    streetAddress: '123 fake street',
    city: 'SpringField',
    state: 'NY',
    zip: '12345',
    type: 'Placement',
    onChange: onChange,
  }
  beforeEach(() => {
    component = shallow(<AddressField {...props}/>)
  })

  it('renders the street address as input field', () => {
    expect(component.find('InputField[label="Address"]').props().value).toEqual('123 fake street')
  })

  it('renders address city as a input field', () => {
    expect(component.find('InputField[label="City"]').props().value).toEqual('SpringField')
  })

  it('renders address zip as a input field', () => {
    expect(component.find('InputField[label="Zip"]').props().value).toEqual('12345')
  })

  it('renders address state as a select field', () => {
    expect(component.find('SelectField[label="State"]').props().value).toEqual('NY')
  })

  it('renders address type as a select field', () => {
    expect(component.find('SelectField[label="Address Type"]').props().value).toEqual('Placement')
  })

  it('calls onChange when  street address field has changed', () => {
    component.find('InputField[label="Address"]').simulate('change', {target: {value: '711 capital street'}})
    expect(onChange).toHaveBeenCalledWith('street_address', '711 capital street')
  })

  it('calls onChange when  city address field has changed', () => {
    component.find('InputField[label="City"]').simulate('change', {target: {value: 'Sacramento'}})
    expect(onChange).toHaveBeenCalledWith('city', 'Sacramento')
  })

  it('calls onChange when zip address field has changed', () => {
    component.find('InputField[label="Zip"]').simulate('change', {target: {value: '56789'}})
    expect(onChange).toHaveBeenCalledWith('zip', '56789')
  })

  it('calls onChange when state address field has changed', () => {
    component.find('SelectField[label="State"]').simulate('change', {target: {value: 'CA'}})
    expect(onChange).toHaveBeenCalledWith('state', 'CA')
  })
  it('calls onChange when address type field has changed', () => {
    component.find('SelectField[label="Address Type"]').simulate('change', {target: {value: 'Work'}})
    expect(onChange).toHaveBeenCalledWith('type', 'Work')
  })
})
