import React from 'react'
import {shallow} from 'enzyme'
import AddressesShow from 'views/people/AddressesShow'

describe('AddressesShow', () => {
  const renderAddressesShow = ({addresses = [], ...options}) => {
    const props = {addresses, ...options}
    return shallow(<AddressesShow {...props} />)
  }

  it('does not render any show fields if there are no addresses', () => {
    const container = renderAddressesShow({addresses: []})
    const showFields = container.find('ShowField')
    expect(showFields.exists()).toEqual(false)
  })

  it('renders the street', () => {
    const addresses = [{street: '1234 Nowhere Lane'}]
    const container = renderAddressesShow({addresses})
    const streetField = container.find('ShowField[label="Address"]')
    expect(streetField.exists()).toEqual(true)
    expect(streetField.children().text()).toEqual('1234 Nowhere Lane')
  })

  it('renders the city', () => {
    const addresses = [{city: 'Somewheresville'}]
    const container = renderAddressesShow({addresses})
    const cityField = container.find('ShowField[label="City"]')
    expect(cityField.exists()).toEqual(true)
    expect(cityField.children().text()).toEqual('Somewheresville')
  })

  it('renders the state', () => {
    const addresses = [{state: 'California'}]
    const container = renderAddressesShow({addresses})
    const stateField = container.find('ShowField[label="State"]')
    expect(stateField.exists()).toEqual(true)
    expect(stateField.children().text()).toEqual('California')
  })

  it('renders the zip code', () => {
    const addresses = [{zip: '12345'}]
    const container = renderAddressesShow({addresses})
    const zipField = container.find('ShowField[label="Zip"]')
    expect(zipField.exists()).toEqual(true)
    expect(zipField.children().text()).toEqual('12345')
  })

  it('renders the address type', () => {
    const addresses = [{type: 'Home'}]
    const container = renderAddressesShow({addresses})
    const typeField = container.find('ShowField[label="Address Type"]')
    expect(typeField.exists()).toEqual(true)
    expect(typeField.children().text()).toEqual('Home')
  })
})
