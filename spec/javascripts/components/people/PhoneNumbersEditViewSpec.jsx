import Immutable from 'immutable'
import React from 'react'
import {PhoneNumbersEditView} from 'components/people/PhoneNumbersEditView'
import {shallow} from 'enzyme'

describe('PhoneNumbersEditView', () => {
  let component
  let onChangePhoneNumbersSpy
  beforeEach(() => {
    const phoneNumbers = Immutable.fromJS([{phone_number: '111-111-1111', phone_number_type: 'Cell'}])
    onChangePhoneNumbersSpy = jasmine.createSpy('onChange')
    component = shallow(
      <PhoneNumbersEditView
        phoneNumbers={phoneNumbers}
        onChange={onChangePhoneNumbersSpy}
      />
    )
  })

  describe('render', () => {
    it('renders numbers', () => {
      expect(component.find('PhoneNumberField').length).toEqual(1)
      expect(component.find('PhoneNumberField').props().phoneNumber).toEqual('111-111-1111')
      expect(component.find('PhoneNumberField').props().phoneNumberType).toEqual('Cell')
    })
  })

  describe('when "Add new phone number" is clicked', () => {
    it('calls onChange and resets state', () => {
      component.find('button[aria-label="Add new phone number"]').simulate('click')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {phone_number: '111-111-1111', phone_number_type: 'Cell'},
        {phone_number: '', phone_number_type: ''},
      ])
    })
  })

  describe('when an existing phone number is changed', () => {
    it('calls onChange with the new phone numbers', () => {
      const input = component.find('PhoneNumberField')
      input.simulate('change', 'phone_number', '332-333-3333')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
          {phone_number: '332-333-3333', phone_number_type: 'Cell'}
      ])
    })
  })

  describe('delete', () => {
    it('calls onChange with the new phone numbers', () => {
      component.find('a[aria-label="Delete phone number"]').simulate('click')
      expect(onChangePhoneNumbersSpy).toHaveBeenCalledWith(Immutable.fromJS([]))
    })
  })
})
