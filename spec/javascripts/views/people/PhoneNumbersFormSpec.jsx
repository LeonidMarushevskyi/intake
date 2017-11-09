import React from 'react'
import {shallow} from 'enzyme'
import PhoneNumbersForm from 'views/people/PhoneNumbersForm'

describe('PhoneNumbersForm', () => {
  const renderPhoneNumbersForm = ({phoneNumbers = [], phoneTypes = [], ...options}) => {
    const props = {phoneNumbers, phoneTypes, ...options}
    return shallow(<PhoneNumbersForm {...props} />)
  }

  it('renders an add new phone number button', () => {
    const component = renderPhoneNumbersForm({})
    const addNewButton = component.find('button')
    expect(addNewButton.exists()).toEqual(true)
    expect(addNewButton.children('span').text()).toEqual(' Add new phone number')
    expect(addNewButton.children('i').props().className).toEqual('fa fa-plus')
    expect(addNewButton.props()['aria-label']).toEqual('Add new phone number')
  })

  it('calls addPhone when the add new button is clicked', () => {
    const addPhone = jasmine.createSpy('addPhone')
    const component = renderPhoneNumbersForm({addPhone})
    const addNewButton = component.find('button')
    addNewButton.simulate('click')
    expect(addPhone).toHaveBeenCalled()
  })

  it('renders a delete link for each phone number passed', () => {
    const phoneNumbers = [{number: ''}, {number: ''}]
    const component = renderPhoneNumbersForm({phoneNumbers})
    const deleteLinks = component.find('a[aria-label="Delete phone number"]')
    expect(deleteLinks.length).toEqual(2)
    const deleteLink = deleteLinks.at(0)
    expect(deleteLink.children('i').props().className).toEqual('fa fa-times')
    expect(deleteLink.props().href).toEqual('#')
    expect(deleteLink.props().className).toEqual('list-item__a')
  })

  it('calls deletePhone with the index when the delete link is clicked', () => {
    const deletePhone = jasmine.createSpy('removePhone')
    const phoneNumbers = [{number: ''}]
    const component = renderPhoneNumbersForm({phoneNumbers, deletePhone})
    const deleteLink = component.find('a[aria-label="Delete phone number"]')
    deleteLink.simulate('click', {preventDefault: () => {}})
    expect(deletePhone).toHaveBeenCalledWith(0)
  })

  it('renders a masked input field for each phone number', () => {
    const phoneNumbers = [{number: ''}, {number: ''}]
    const component = renderPhoneNumbersForm({phoneNumbers})
    const phoneNumberInputs = component.find('MaskedInputField')
    expect(phoneNumberInputs.length).toEqual(2)
  })

  it('passes the default props to the phone number input', () => {
    const phoneNumbers = [{number: '0123456789'}]
    const component = renderPhoneNumbersForm({phoneNumbers})
    const phoneNumberInput = component.find('MaskedInputField')
    expect(phoneNumberInput.props().id).toEqual('number-0')
    expect(phoneNumberInput.props().label).toEqual('Phone Number')
    expect(phoneNumberInput.props().mask).toEqual('(111)111-1111')
    expect(phoneNumberInput.props().maxLength).toEqual('13')
    expect(phoneNumberInput.props().type).toEqual('tel')
    expect(phoneNumberInput.props().value).toEqual('0123456789')
  })

  it('passes an onChange function to the phone number input', () => {
    const onChange = jasmine.createSpy('onChange')
    const phoneNumbers = [{number: ''}]
    const component = renderPhoneNumbersForm({onChange, phoneNumbers})
    const phoneNumberInput = component.find('MaskedInputField')
    expect(phoneNumberInput.props().onChange).toEqual(jasmine.any(Function))
  })

  it('renders a type select for each phone number', () => {
    const phoneNumbers = [{number: ''}, {number: ''}]
    const component = renderPhoneNumbersForm({phoneNumbers})
    const phoneNumberInputs = component.find('SelectField')
    expect(phoneNumberInputs.length).toEqual(2)
  })

  it('passes the default props to the type select', () => {
    const phoneNumbers = [{type: 'Home'}]
    const component = renderPhoneNumbersForm({phoneNumbers})
    const typeSelect = component.find('SelectField')
    expect(typeSelect.props().id).toEqual('type-0')
    expect(typeSelect.props().label).toEqual('Phone Number Type')
    expect(typeSelect.props().value).toEqual('Home')
  })

  it('renders the phoneTypes as options for the type select', () => {
    const phoneTypes = [{value: 'home', label: 'Home'}, {value: 'cell', label: 'Cell'}]
    const phoneNumbers = [{type: ''}]
    const component = renderPhoneNumbersForm({phoneNumbers, phoneTypes})
    const typeSelectOptions = component.find('SelectField').children()
    expect(typeSelectOptions.at(0).props().value).toEqual(undefined)
    expect(typeSelectOptions.at(1).props().value).toEqual('home')
    expect(typeSelectOptions.at(1).children().text()).toEqual('Home')
    expect(typeSelectOptions.at(2).props().value).toEqual('cell')
    expect(typeSelectOptions.at(2).children().text()).toEqual('Cell')
  })

  it('passes an onChange function to the type select', () => {
    const onChange = jasmine.createSpy('onChange')
    const phoneNumbers = [{type: ''}]
    const component = renderPhoneNumbersForm({onChange, phoneNumbers})
    const typeSelect = component.find('SelectField')
    expect(typeSelect.props().onChange).toEqual(jasmine.any(Function))
  })
})
