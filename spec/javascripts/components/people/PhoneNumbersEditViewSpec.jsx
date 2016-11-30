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
        onChange={onChangePhoneNumbersSpy} />)
    component.setState({
      new_phone_number: Immutable.Map({
        phone_number: '222-222-2222',
        phone_number_type: 'work',
      })
    })
  })

  describe('render', () => {
    it('renders the new and added phone numbers', () => {
      expect(component.find('.bg-gray-lightest').length).toEqual(2)
      expect(component.find('#added_phone_numbers InputField').props().value).toEqual('111-111-1111')
      expect(component.find('#added_phone_numbers InputField').props().placeholder).toEqual('Ex: 910-435-3223')
      expect(component.find('#added_phone_numbers InputField').props().type).toEqual('tel')
      expect(component.find('#added_phone_numbers SelectField').props().value).toEqual('cell')
      expect(component.find('#new_phone_number InputField').props().value).toEqual('222-222-2222')
      expect(component.find('#new_phone_number InputField').props().placeholder).toEqual('Ex: 910-435-3223')
      expect(component.find('#new_phone_number InputField').props().type).toEqual('tel')
      expect(component.find('#new_phone_number SelectField').props().value).toEqual('work')
    })
  })

  describe('add', () => {
    it('calls onChange and resets state', () => {
      component.find('button.bg-gray-dark').simulate('click')

      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {phone_number: '111-111-1111', phone_number_type: 'cell'},
        {phone_number: '222-222-2222', phone_number_type: 'work'},
      ])
      expect(component.find('#new_phone_number InputField').props().value).toEqual('')
      expect(component.find('#new_phone_number SelectField[label="Phone Number Type"]').props().value).toEqual('')
    })
  })

  describe('edit', () => {
    it('calls onChange with the new phone numbers', () => {
      const input = component.find('#added_phone_numbers InputField')
      input.simulate('change', {target: {value: '332-333-3333'}})

      expect(onChangePhoneNumbersSpy).toHaveBeenCalled()
      expect(onChangePhoneNumbersSpy.calls.argsFor(0)[0].toJS()).toEqual([
          {phone_number: '332-333-3333', phone_number_type: 'cell'}
      ])
    })
  })

  describe('delete', () => {
    it('calls onChange with the new phone numbers', () => {
      component.find('button.bg-secondary-red').simulate('click')

      expect(onChangePhoneNumbersSpy).toHaveBeenCalledWith(Immutable.fromJS([]))
    })
  })
})
