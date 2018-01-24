import React from 'react'
import {shallow} from 'enzyme'
import IncidentInformationForm from 'views/IncidentInformationForm'

describe('IncidentInformationForm', () => {
  const renderIncidentInformationForm = ({errors = {}, address = {}, counties = [], locationTypes = [], usStates = [], ...args}) => {
    const props = {errors, address, counties, locationTypes, usStates, ...args}
    return shallow(<IncidentInformationForm {...props}/>)
  }

  describe('DateField for Incident Date', () => {
    it('renders the incident date field', () => {
      const component = renderIncidentInformationForm({incidentDate: '1/2/2006'})
      expect(component.find('DateField[label="Incident Date"]').props().value).toEqual('1/2/2006')
    })

    it('datetime fires onChange callback', () => {
      const component = renderIncidentInformationForm({
        onChange: jasmine.createSpy('onChange'),
      })
      component.find('DateField[label="Incident Date"]').simulate('change', 'new value')
      expect(component.instance().props.onChange).toHaveBeenCalledWith(['incident_date'], 'new value')
    })

    it('datetime fires onBlur callback', () => {
      const component = renderIncidentInformationForm({
        onBlur: jasmine.createSpy('onBlur'),
      })
      component.find('DateField[label="Incident Date"]').simulate('blur')
      expect(component.instance().props.onBlur).toHaveBeenCalledWith('incident_date')
    })

    it('renders the incident date field with errors', () => {
      const component = renderIncidentInformationForm({
        errors: {
          incident_date: ['error one'],
        },
      })
      expect(component.find('DateField[label="Incident Date"]').props().errors).toEqual(['error one'])
    })
  })

  describe('Incident Address', () => {
    it('renders the incident address header', () => {
      const component = renderIncidentInformationForm({})
      expect(component.find('legend').text()).toEqual('Incident Address')
    })

    describe('Street Address', () => {
      it('renders the street address field and its callbacks', () => {
        const component = renderIncidentInformationForm({
          address: {
            streetAddress: '1234 C street',
          },
        })
        expect(component.find('InputField[label="Address"]').props().value).toEqual('1234 C street')
      })

      it('fires onChange callback', () => {
        const component = renderIncidentInformationForm({
          onChange: jasmine.createSpy('onChange'),
        })
        component.find('InputField[label="Address"]').simulate('change', {target: {value: 'new value'}})
        expect(component.instance().props.onChange).toHaveBeenCalledWith(['address', 'street_address'], 'new value')
      })
    })

    describe('City', () => {
      it('renders the city field', () => {
        const component = renderIncidentInformationForm({
          address: {
            city: 'Sacramento',
          },
        })
        expect(component.find('InputField[label="City"]').props().value).toEqual('Sacramento')
      })

      it('fires onChange callback', () => {
        const component = renderIncidentInformationForm({
          onChange: jasmine.createSpy('onChange'),
        })
        component.find('InputField[label="City"]').simulate('change', {target: {value: 'new value'}})
        expect(component.instance().props.onChange).toHaveBeenCalledWith(['address', 'city'], 'new value')
      })
    })

    describe('Incident County', () => {
      it('renders the county field', () => {
        const component = renderIncidentInformationForm({
          selectedCounty: 'Yolo',
        })
        expect(component.find('SelectField[label="Incident County"]').props().value).toEqual('Yolo')
      })
      it('renders the county options', () => {
        const component = renderIncidentInformationForm({
          counties: [
            {
              key: 'something',
              name: 'name',
            },
          ],
        })
        expect(component.find('option[value="something"]').text()).toEqual('name')
      })

      it('fires onChange callback', () => {
        const component = renderIncidentInformationForm({
          onChange: jasmine.createSpy('onChange'),
        })
        component.find('SelectField[label="Incident County"]').simulate('change', {target: {value: 'new value'}})
        expect(component.instance().props.onChange).toHaveBeenCalledWith(['incident_county'], 'new value')
      })
    })

    describe('State', () => {
      it('renders the state field', () => {
        const component = renderIncidentInformationForm({
          address: {
            state: 'Yolo',
          },
        })
        expect(component.find('SelectField[label="State"]').props().value).toEqual('Yolo')
      })
      it('renders the state options', () => {
        const component = renderIncidentInformationForm({
          usStates: [
            {
              code: 'CA',
              name: 'California',
            },
          ],
        })
        expect(component.find('SelectField[label="State"] option[value="CA"]').text()).toEqual('California')
      })

      it('fires onChange callback', () => {
        const component = renderIncidentInformationForm({
          onChange: jasmine.createSpy('onChange'),
        })
        component.find('SelectField[label="State"]').simulate('change', {target: {value: 'new value'}})
        expect(component.instance().props.onChange).toHaveBeenCalledWith(['address', 'state'], 'new value')
      })
    })

    describe('Zip Code', () => {
      it('renders the zip code field', () => {
        const component = renderIncidentInformationForm({
          address: {
            zip: '95675',
          },
        })
        expect(component.find('InputField[label="Zip"]').props().value).toEqual('95675')
      })

      it('fires onChange callback', () => {
        const component = renderIncidentInformationForm({
          onChange: jasmine.createSpy('onChange'),
        })
        component.find('InputField[label="Zip"]').simulate('change', {target: {value: 'new value'}})
        expect(component.instance().props.onChange).toHaveBeenCalledWith(['address', 'zip'], 'new value')
      })
    })
  })

  describe('Location Type', () => {
    it('renders the location type field', () => {
      const component = renderIncidentInformationForm({
        selectedLocationType: 'location type',
      })
      expect(component.find('SelectField[label="Location Type"]').props().value).toEqual('location type')
    })

    it('renders the location type options', () => {
      const component = renderIncidentInformationForm({
        locationTypes: [
          {
            name: 'location name',
            locations: [
              'location one',
              'location two',
            ],
          },
        ],
      })
      expect(component.find('SelectField[label="Location Type"] optgroup[value="location name"]').exists()).toEqual(true)
      expect(component.find('optgroup[value="location name"] option[value="location one"]').text()).toEqual('location one')
      expect(component.find('optgroup[value="location name"] option[value="location two"]').text()).toEqual('location two')
    })

    it('fires onChange callback', () => {
      const component = renderIncidentInformationForm({
        onChange: jasmine.createSpy('onChange'),
      })
      component.find('SelectField[label="Location Type"]').simulate('change', {target: {value: 'new value'}})
      expect(component.instance().props.onChange).toHaveBeenCalledWith(['location_type'], 'new value')
    })
  })

  it('renders the save button', () => {
    const component = renderIncidentInformationForm({
      onSave: jasmine.createSpy(),
    })
    component.find('.btn.btn-primary').simulate('click')
    expect(component.instance().props.onSave).toHaveBeenCalled()
  })

  it('renders the cancel button', () => {
    const component = renderIncidentInformationForm({
      onCancel: jasmine.createSpy(),
    })
    component.find('.btn.btn-default').simulate('click')
    expect(component.instance().props.onCancel).toHaveBeenCalled()
  })
})
