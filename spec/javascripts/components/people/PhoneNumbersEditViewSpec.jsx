import Immutable from 'immutable'
import React from 'react'
import {PhoneNumbersEditView} from 'components/people/PhoneNumbersEditView'
import {shallow} from 'enzyme'

describe('PhoneNumbersEditView', () => {
  let component
  let onChangePhoneNumbersSpy
  beforeEach(() => {
    const phoneNumbers = Immutable.fromJS([{phone_number: '111-111-1111', phone_number_type: 'cell'}])
    onChangePhoneNumbersSpy = jasmine.createSpy('onChange')
    component = shallow(
      <PhoneNumbersEditView
        phoneNumbers={phoneNumbers}
        onChange={onChangePhoneNumbersSpy}
      />
    )
    component.setState({
      new_phone_number: Immutable.Map({
        phone_number: '222-222-2222',
        phone_number_type: 'work',
      })
    })
  })

  describe('render', () => {
    it('renders the new and added phone numbers', () => {
      expect(component.find('PhoneNumberField').length).toEqual(2)
      expect(component.find('#added_phone_numbers PhoneNumberField').props().phoneNumber).toEqual('111-111-1111')
      expect(component.find('#added_phone_numbers PhoneNumberField').props().phoneNumberType).toEqual('cell')
      expect(component.find('#new_phone_number PhoneNumberField').props().phoneNumber).toEqual('222-222-2222')
      expect(component.find('#new_phone_number PhoneNumberField').props().phoneNumberType).toEqual('work')
    })
  })

  describe('add', () => {
    it('calls onChange and resets state', () => {
      component.find('button[children="Add"]').simulate('click')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {phone_number: '111-111-1111', phone_number_type: 'cell'},
        {phone_number: '222-222-2222', phone_number_type: 'work'},
      ])
      expect(component.find('#new_phone_number PhoneNumberField').props().phoneNumber).toEqual('')
      expect(component.find('#new_phone_number PhoneNumberField').props().phoneNumberType).toEqual('')
    })
  })

  describe('edit', () => {
    it('calls onChange with the new phone numbers', () => {
      const input = component.find('#added_phone_numbers PhoneNumberField')
      input.simulate('change', 'phone_number', '332-333-3333')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
          {phone_number: '332-333-3333', phone_number_type: 'cell'}
      ])
    })
  })

  describe('delete', () => {
    it('calls onChange with the new phone numbers', () => {
      component.find('button[children="Delete"]').simulate('click')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalledWith(Immutable.fromJS([]))
    })
  })
})
