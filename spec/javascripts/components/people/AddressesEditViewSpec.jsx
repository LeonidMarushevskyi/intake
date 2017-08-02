import Immutable from 'immutable'
import React from 'react'
import AddressesEditView from 'components/people/AddressesEditView'
import {shallow} from 'enzyme'

describe('AddressesEditView', () => {
  let component
  let onChangeaddressSpy
  beforeEach(() => {
    const addresses = Immutable.fromJS(
      [{street_address: '123 fake st',
        city: 'Springfield',
        state: 'NY',
        zip: '12345',
        type: 'Work',
      }])
    onChangeaddressSpy = jasmine.createSpy('onChange')
    component = shallow(
      <AddressesEditView
        addresses={addresses}
        onChange={onChangeaddressSpy}
      />
    )
  })

  describe('render', () => {
    it('renders each of the address fields', () => {
      expect(component.find('AddressEditView').length).toEqual(1)
      expect(component.find('AddressEditView').props().streetAddress).toEqual('123 fake st')
      expect(component.find('AddressEditView').props().city).toEqual('Springfield')
      expect(component.find('AddressEditView').props().state).toEqual('NY')
      expect(component.find('AddressEditView').props().zip).toEqual('12345')
      expect(component.find('AddressEditView').props().type).toEqual('Work')
    })

    it('calls onChange when the address field changes', () => {
      component.find('AddressEditView').simulate('change', 'zip', '56789')
      expect(onChangeaddressSpy).toHaveBeenCalled()
      expect(onChangeaddressSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '56789',
          type: 'Work',
        },
      ])
    })

    it('calls onChange when "Add new address" is clicked', () => {
      component.find('button[aria-label="Add address"]').simulate('click')
      expect(onChangeaddressSpy).toHaveBeenCalled()
      expect(onChangeaddressSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'Work',
        },
        {
          street_address: null,
          city: null,
          state: null,
          zip: null,
          type: null,
        },
      ])
    })

    it('calls onChange when is delete address is click', () => {
      const event = jasmine.createSpyObj('event', ['preventDefault'])
      component.find('a[aria-label="Delete address"]').simulate('click', event)
      expect(onChangeaddressSpy).toHaveBeenCalledWith(Immutable.fromJS([]))
    })
  })
})
