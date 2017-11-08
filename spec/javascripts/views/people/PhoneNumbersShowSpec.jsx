import React from 'react'
import {shallow} from 'enzyme'
import PhoneNumbersShow from 'views/people/PhoneNumbersShow'

describe('PhoneNumbersShow', () => {
  const renderPhoneNumbersShow = ({phoneNumbers = [], ...options}) => {
    const props = {phoneNumbers, ...options}
    return shallow(<PhoneNumbersShow {...props} />)
  }

  it('does not render any show fields if phoneNumbers is an empty array', () => {
    const component = renderPhoneNumbersShow({phoneNumbers: []})
    expect(component.html()).toEqual('<div></div>')
  })

  it('renders a phone number for each phoneNumber present', () => {
    const phoneNumbers = [{number: '(123) 456-7890'}, {number: '(098) 765-4321'}]
    const component = renderPhoneNumbersShow({phoneNumbers})
    const phoneNumberShowFields = component.find('ShowField[label="Phone Number"]')
    expect(phoneNumberShowFields.length).toEqual(2)
    expect(phoneNumberShowFields.at(0).children().text()).toEqual('(123) 456-7890')
    expect(phoneNumberShowFields.at(1).children().text()).toEqual('(098) 765-4321')
  })

  it('renders a phone type for each phoneNumber present', () => {
    const phoneNumbers = [{type: 'Home'}, {type: 'Cell'}]
    const component = renderPhoneNumbersShow({phoneNumbers})
    const phoneTypeShowFields = component.find('ShowField[label="Phone Number Type"]')
    expect(phoneTypeShowFields.length).toEqual(2)
    expect(phoneTypeShowFields.at(0).children().text()).toEqual('Home')
    expect(phoneTypeShowFields.at(1).children().text()).toEqual('Cell')
  })
})
