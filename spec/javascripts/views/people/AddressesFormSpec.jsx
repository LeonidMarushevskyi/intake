import React from 'react'
import {shallow} from 'enzyme'
import AddressesForm from 'views/people/AddressesForm'

describe('AddressForm', () => {
  const renderAddressesForm = ({addresses = [], addressTypeOptions = [], stateOptions = [], ...options}) => {
    const props = {addresses, addressTypeOptions, stateOptions, ...options}
    return shallow(<AddressesForm {...props} />)
  }

  it('renders a button to add a new address', () => {
    const component = renderAddressesForm({})
    const addNewButton = component.find('button')
    expect(addNewButton.exists()).toEqual(true)
    expect(addNewButton.props()['aria-label']).toEqual('Add address')
    expect(addNewButton.children('span').text()).toEqual(' Add new address')
    expect(addNewButton.children('i').props().className).toEqual('fa fa-plus')
  })

  it('calls addAddress when add new address is clicked', () => {
    const addAddress = jasmine.createSpy('addAddress')
    const component = renderAddressesForm({addAddress})
    const addNewButton = component.find('button')
    addNewButton.simulate('click')
    expect(addAddress).toHaveBeenCalled()
  })

  it('renders a delete link for every address', () => {
    const addresses = [{}, {}]
    const component = renderAddressesForm({addresses})
    const deleteLinks = component.find('a[aria-label="Delete address"]')
    expect(deleteLinks.length).toEqual(2)
  })

  it('passes default props to the delete link', () => {
    const addresses = [{}]
    const component = renderAddressesForm({addresses})
    const deleteLink = component.find('a[aria-label="Delete address"]')
    expect(deleteLink.props().href).toEqual('#')
    expect(deleteLink.props().className).toEqual('list-item__a')
    expect(deleteLink.children('i').props().className).toEqual('fa fa-times')
  })

  it('calls delete address with the index of the address when the delete link is clicked', () => {
    const deleteAddress = jasmine.createSpy('deleteAddress')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, deleteAddress})
    const deleteLink = component.find('a[aria-label="Delete address"]')
    deleteLink.simulate('click', {preventDefault: () => {}})
    expect(deleteAddress).toHaveBeenCalledWith(0)
  })

  it('renders an input for street with default params and a value', () => {
    const addresses = [{street: '1234 Nowhere Lane'}]
    const component = renderAddressesForm({addresses})
    const streetInput = component.find('InputField[label="Address"]')
    expect(streetInput.props().maxLength).toEqual('128')
    expect(streetInput.props().value).toEqual('1234 Nowhere Lane')
  })

  it('calls onChange when the street is updated', () => {
    const onChange = jasmine.createSpy('onChange')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, onChange})
    const streetInput = component.find('InputField[label="Address"]')
    streetInput.simulate('change', {target: {value: '1234 Somewhere Street'}})
    expect(onChange).toHaveBeenCalledWith(0, 'street', '1234 Somewhere Street')
  })

  it('renders an input for city with default props and a value', () => {
    const addresses = [{city: 'Nowheresville'}]
    const component = renderAddressesForm({addresses})
    const streetInput = component.find('InputField[label="City"]')
    expect(streetInput.props().maxLength).toEqual('64')
    expect(streetInput.props().value).toEqual('Nowheresville')
  })

  it('calls onChange when the city is updated', () => {
    const onChange = jasmine.createSpy('onChange')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, onChange})
    const cityInput = component.find('InputField[label="City"]')
    cityInput.simulate('change', {target: {value: 'Somewheresville'}})
    expect(onChange).toHaveBeenCalledWith(0, 'city', 'Somewheresville')
  })

  it('renders a state select field with proper value', () => {
    const addresses = [{state: 'CA'}]
    const component = renderAddressesForm({addresses})
    const stateSelect = component.find('SelectField[label="State"]')
    expect(stateSelect.props().value).toEqual('CA')
  })

  it('renders stateOptions for the state select field', () => {
    const stateOptions = [{value: 'CA', label: 'California'}, {value: 'AZ', label: 'Arizona'}]
    const addresses = [{}]
    const component = renderAddressesForm({stateOptions, addresses})
    const stateSelect = component.find('SelectField[label="State"]')
    const stateSelectOptions = stateSelect.children()
    expect(stateSelectOptions.at(0).text()).toEqual('')
    expect(stateSelectOptions.at(1).props().value).toEqual('CA')
    expect(stateSelectOptions.at(1).children().text()).toEqual('California')
    expect(stateSelectOptions.at(2).props().value).toEqual('AZ')
    expect(stateSelectOptions.at(2).children().text()).toEqual('Arizona')
  })

  it('calls onChange when the state is updated', () => {
    const onChange = jasmine.createSpy('onChange')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, onChange})
    const stateSelect = component.find('SelectField[label="State"]')
    stateSelect.simulate('change', {target: {value: 'CA'}})
    expect(onChange).toHaveBeenCalledWith(0, 'state', 'CA')
  })

  it('renders an input for zip with default props and a value', () => {
    const addresses = [{zip: '55555'}]
    const component = renderAddressesForm({addresses})
    const streetInput = component.find('InputField[label="Zip"]')
    expect(streetInput.props().maxLength).toEqual('10')
    expect(streetInput.props().value).toEqual('55555')
    expect(streetInput.props().allowCharacters).toEqual(/[0-9-]/)
  })

  it('calls onChange when the zip is updated', () => {
    const onChange = jasmine.createSpy('onChange')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, onChange})
    const zipInput = component.find('InputField[label="Zip"]')
    zipInput.simulate('change', {target: {value: '55555'}})
    expect(onChange).toHaveBeenCalledWith(0, 'zip', '55555')
  })

  it('renders a type select field with proper value', () => {
    const addresses = [{type: 'Home'}]
    const component = renderAddressesForm({addresses})
    const typeSelect = component.find('SelectField[label="Address Type"]')
    expect(typeSelect.props().value).toEqual('Home')
  })

  it('renders typeOptions for the type select field', () => {
    const addressTypeOptions = [{value: 'home', label: 'Home'}, {value: 'school', label: 'School'}]
    const addresses = [{}]
    const component = renderAddressesForm({addressTypeOptions, addresses})
    const typeSelect = component.find('SelectField[label="Address Type"]')
    const typeSelectOptions = typeSelect.children()
    expect(typeSelectOptions.at(0).text()).toEqual('')
    expect(typeSelectOptions.at(1).props().value).toEqual('home')
    expect(typeSelectOptions.at(1).children().text()).toEqual('Home')
    expect(typeSelectOptions.at(2).props().value).toEqual('school')
    expect(typeSelectOptions.at(2).children().text()).toEqual('School')
  })

  it('calls onChange when the type is updated', () => {
    const onChange = jasmine.createSpy('onChange')
    const addresses = [{}]
    const component = renderAddressesForm({addresses, onChange})
    const typeSelect = component.find('SelectField[label="Address Type"]')
    typeSelect.simulate('change', {target: {value: 'Home'}})
    expect(onChange).toHaveBeenCalledWith(0, 'type', 'Home')
  })
})
