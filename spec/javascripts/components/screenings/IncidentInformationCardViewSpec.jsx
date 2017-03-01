import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import Immutable from 'immutable'
import React from 'react'
import {mount} from 'enzyme'

describe('IncidentInformationCardView', () => {
  let component
  const props = {
    onCancel: jasmine.createSpy(),
    onChange: jasmine.createSpy(),
    onEdit: jasmine.createSpy(),
    onSave: jasmine.createSpy('onSave'),
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
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation',
    }),
  }
  const promiseObj = jasmine.createSpyObj('promiseObj', ['then'])

  describe('render', () => {
    describe('when mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
        component = mount(<IncidentInformationCardView {...props} mode='edit'/>)
      })

      it('renders the incident edit card', () => {
        expect(component.find('IncidentInformationEditView').length).toEqual(1)
      })

      describe('when a user clicks Cancel', () => {
        beforeEach(() => {
          const cancelButton = component.find('button[children="Cancel"]')
          cancelButton.simulate('click')
        })

        it('the show view of incident information is rendered', () => {
          expect(component.find('IncidentInformationShowView').length).toEqual(1)
        })
      })

      describe('when a user clicks Save', () => {
        beforeEach(() => {
          const saveButton = component.find('button[children="Save"]')
          saveButton.simulate('click')
        })

        it('calls the props onSave', () => {
          expect(props.onSave).toHaveBeenCalled()
        })

        it('the incident information show view is rendered', () => {
          expect(component.find('IncidentInformationShowView').length).toEqual(1)
        })
      })
    })

    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = mount(<IncidentInformationCardView {...props} mode='show'/>)
      })
      it('renders the incident show card', () => {
        expect(component.find('IncidentInformationShowView').length).toEqual(1)
      })

      describe('when the user clicks edit link', () => {
        beforeEach(() => {
          const editLink = component.find('a[aria-label="Edit incident information"]')
          editLink.simulate('click')
        })

        it('it renders the incident edit card', () => {
          expect(component.find('IncidentInformationEditView').length).toEqual(1)
        })
      })
    })
  })
})
