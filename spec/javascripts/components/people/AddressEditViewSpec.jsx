import Immutable from 'immutable'
import React from 'react'
import {AddressEditView} from 'components/people/AddressEditView'
import {shallow} from 'enzyme'

describe('AddressEditView', () => {
  let component
  let onChangeaddressSpy
  beforeEach(() => {
  const addresses = Immutable.fromJS(
    [{street_address: '123 fake st',
      city: 'Springfield',
      state: 'NY',
      zip: '12345',
      type: 'Placement'
    }])
  onChangeaddressSpy = jasmine.createSpy('onChange')
  component = shallow(
    <AddressEditView
      addresses={addresses}
      onChange={onChangeaddressSpy}
    />
  )
  })
  describe('render', () => {
    it('renders each of the address fields', () => {
      expect(component.find('AddressField').length).toEqual(1)
      expect(component.find('AddressField').props().streetAddress).toEqual('123 fake st')
      expect(component.find('AddressField').props().city).toEqual('Springfield')
      expect(component.find('AddressField').props().state).toEqual('NY')
      expect(component.find('AddressField').props().zip).toEqual('12345')
      expect(component.find('AddressField').props().type).toEqual('Placement')
    })

    it('calls onChange when the address field changes', () => {
      component.find('AddressField').simulate('change', 'zip', '56789')
      expect(onChangeaddressSpy).toHaveBeenCalled()
      expect(onChangeaddressSpy.calls.argsFor(0)[0].toJS()).toEqual([
        {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '56789',
          type: 'Placement'
        }
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
          type: 'Placement'
        },
        {
          street_address: '',
          city: '',
          state: '',
          zip: '',
          type: ''
        },
      ])
    })

    it('calls onChange when is delete address is click', () => {
      const event = jasmine.createSpyObj('event', ['preventDefault'])
      component.find('a[aria-label="Delete address"]').simulate('click',event)
      expect(onChangeaddressSpy).toHaveBeenCalledWith(Immutable.fromJS([]))
    })
  })
})
