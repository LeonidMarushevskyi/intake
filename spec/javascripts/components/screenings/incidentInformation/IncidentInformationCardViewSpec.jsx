import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('IncidentInformationCardView', () => {
  let component
  let promiseObj
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
    errors: Immutable.List(),
  }

  beforeEach(() => {
    props.onCancel = jasmine.createSpy('onCancel')
    props.onChange = jasmine.createSpy('onChange')
    props.onSave = jasmine.createSpy('onSave')
    props.onEdit = jasmine.createSpy('onEdit')
    promiseObj = jasmine.createSpyObj('promiseObj', ['then'])
  })

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

      it('passes errors to the edit view', () => {
        expect(component.find('IncidentInformationEditView').props().errors).toEqual(Immutable.List())
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

        it('sets displayErrorsFor to all of the fields', () => {
          expect(component.update().state().displayErrorsFor.toJS())
            .toEqual(['address', 'incident_county', 'incident_date', 'location_type'])
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

      it('passes errors to the edit view', () => {
        expect(component.find('IncidentInformationShowView').props().errors).toEqual(Immutable.List())
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
      expect(errors.toJS()).toEqual({foo: ['foo error']})
      expect(Immutable.is(errors, Immutable.fromJS({foo: ['foo error']}))).toEqual(true)
    })
  })
})
