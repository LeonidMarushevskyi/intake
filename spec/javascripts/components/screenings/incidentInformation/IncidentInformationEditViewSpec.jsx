import Immutable from 'immutable'
import React from 'react'
import IncidentInformationEditView from 'screenings/IncidentInformationEditView'
import {shallow, mount} from 'enzyme'

describe('IncidentInformationEditView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      onBlur: jasmine.createSpy(),
      screening: Immutable.fromJS({
        incident_date: '2006-01-21',
        incident_county: 'alpine',
        address: {
          id: '2',
          street_address: '1500 7th St',
          city: 'Sacramento',
          state: 'CA',
          zip: '95814',
        },
        location_type: 'Juvenile Detention',
      }),
      errors: Immutable.fromJS({incident_date: []}),
    }
    component = shallow(<IncidentInformationEditView {...props} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toEqual('Incident Information')
  })

  it('renders the Incident date field', () => {
    expect(component.find('DateField[label="Incident Date"]').props().value)
      .toEqual('2006-01-21')
  })

  it('renders the incident county field', () => {
    expect(component.find('SelectField[label="Incident County"]').props().value)
      .toEqual('alpine')
  })

  it('renders the address field', () => {
    const addressField = component.find('InputField[label="Address"]')
    expect(addressField.props().value).toEqual('1500 7th St')
    expect(addressField.props().maxLength).toEqual('128')
  })

  it('renders the city field', () => {
    const cityField = component.find('InputField[label="City"]')
    expect(cityField.props().value).toEqual('Sacramento')
    expect(cityField.props().maxLength).toEqual('64')
  })

  it('renders the zip field', () => {
    const zipField = component.find('InputField[label="Zip"]')
    expect(zipField.props().value).toEqual('95814')
    expect(zipField.props().maxLength).toEqual('10')
  })

  it('renders the state field', () => {
    expect(component.find('SelectField[label="State"]').props().value)
      .toEqual('CA')
  })

  it('renders the location type field', () => {
    expect(component.find('SelectField[label="Location Type"]').props().value)
      .toEqual('Juvenile Detention')
  })

  it('passes errors to incident date', () => {
    const incidentDate = component.find('DateField[label="Incident Date"]')
    expect(incidentDate.props().errors).toEqual(Immutable.List())
  })

  it('calls onBlur with the proper field name when incident date is blurred', () => {
    const incidentDate = component.find('DateField[label="Incident Date"]')
    incidentDate.simulate('blur')
    expect(props.onBlur).toHaveBeenCalledWith('incident_date')
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('fires the onChange call when a field changes', () => {
    component.find('#incident_date').simulate('change', '01/21/2006')
    expect(props.onChange).toHaveBeenCalledWith(['incident_date'], '01/21/2006')
  })

  it('calls onSave', () => {
    component = mount(<IncidentInformationEditView {...props} />)
    component.find('.btn.btn-primary').simulate('click')
    expect(props.onSave).toHaveBeenCalled()
  })

  it('calls onCancel', () => {
    component = mount(<IncidentInformationEditView {...props} />)
    component.find('.btn.btn-default').simulate('click')
    expect(props.onCancel).toHaveBeenCalled()
  })
})
