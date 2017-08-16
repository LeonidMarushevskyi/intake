import React from 'react'
import {shallow} from 'enzyme'
import AddressEditView from 'common/AddressEditView'

describe('AddressEditView', () => {
  let component
  const onChange = jasmine.createSpy('onChange')
  const props = {
    streetAddress: '123 fake street',
    city: 'SpringField',
    state: 'NY',
    zip: '12345',
    type: 'Work',
    onChange: onChange,
  }
  beforeEach(() => {
    component = shallow(<AddressEditView {...props}/>)
  })

  it('renders the street address as input field', () => {
    const addressField = component.find('InputField[label="Address"]')
    expect(addressField.props().value).toEqual('123 fake street')
    expect(addressField.props().maxLength).toEqual('128')
  })

  it('renders address city as a input field', () => {
    const cityField = component.find('InputField[label="City"]')
    expect(cityField.props().value).toEqual('SpringField')
    expect(cityField.props().maxLength).toEqual('64')
  })

  it('renders address zip as a input field', () => {
    const zipField = component.find('InputField[label="Zip"]')
    expect(zipField.props().value).toEqual('12345')
    expect(zipField.props().maxLength).toEqual('10')
    // Allow digits and hyphen
    expect(zipField.props().allowCharacters).toEqual(/[0-9\-]/)
  })

  it('renders address state as a select field', () => {
    expect(component.find('SelectField[label="State"]').props().value).toEqual('NY')
  })

  it('renders address type as a select field', () => {
    expect(component.find('SelectField[label="Address Type"]').props().value).toEqual('Work')
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
