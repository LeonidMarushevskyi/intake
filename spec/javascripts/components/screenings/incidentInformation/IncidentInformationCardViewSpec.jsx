import IncidentInformationCardView from 'screenings/IncidentInformationCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('IncidentInformationCardView', () => {
  let component
  const props = {
    screening: Immutable.fromJS({
      incident_date: '2006-01-21',
      incident_county: 'alpine',
      address: {
        street_address: '1500 7th St',
        city: 'Sacramento',
        state: 'CA',
        zip: '95814',
      },
      location_type: 'Juvenile Detention',
    }),
    errors: Immutable.Map(),
    editable: true,
  }

  beforeEach(() => {
    props.onCancel = jasmine.createSpy('onCancel')
    props.onChange = jasmine.createSpy('onChange')
    props.onSave = jasmine.createSpy('onSave')
    props.onEdit = jasmine.createSpy('onEdit')
  })

  it('renders the card header', () => {
    const component = shallow(<IncidentInformationCardView {...props} mode='edit'/>)
    const header = component.find('ScreeningCardHeader')
    expect(header.length).toEqual(1)
    expect(header.props().onEdit).toEqual(component.instance().onEdit)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Incident Information')
  })

  describe('render', () => {
    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = shallow(<IncidentInformationCardView {...props} mode='show'/>)
      })
      it('renders the incident show card', () => {
        expect(component.find('Connect(IncidentInformationShow)').length).toEqual(1)
      })

      it('passes errors to the edit view', () => {
        expect(component.find('Connect(IncidentInformationShow)').props().errors).toEqual({})
      })
    })
  })

  describe('onBlur', () => {
    it('adds the proper field to the list of fields to display errors for', () => {
      const component = shallow(<IncidentInformationCardView {...props} mode={'edit'}/>)
      component.instance().onBlur('incident_date')
      expect(component.state().displayErrorsFor.toJS()).toEqual(['incident_date'])
    })
  })

  describe('filteredErrors', () => {
    it('only returns errors for fields that are in the displayErrorFor list', () => {
      const errorProps = Immutable.fromJS({foo: ['foo error'], bar: ['bar error']})
      const component = shallow(<IncidentInformationCardView {...props} mode={'edit'} errors={errorProps}/>)
      component.setState({displayErrorsFor: Immutable.List(['foo'])})
      const errors = component.instance().filteredErrors()
      expect(errors).toEqual({foo: ['foo error']})
    })
  })
})
