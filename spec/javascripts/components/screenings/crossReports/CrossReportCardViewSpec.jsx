import CrossReportCardView from 'components/screenings/CrossReportCardView'
import Immutable from 'immutable'
import React from 'react'
import {mount} from 'enzyme'

describe('CrossReportCardView', () => {
  let component
  const props = {
    onCancel: jasmine.createSpy(),
    onChange: jasmine.createSpy(),
    onEdit: jasmine.createSpy(),
    onSave: jasmine.createSpy(),
    allegations: Immutable.fromJS([
      {allegation_types: ['Exploitation', 'Severe neglect']},
      {allegation_types: ['General neglect']},
    ]),
    crossReports: Immutable.fromJS([
      {agency_type: 'District attorney', agency_name: 'SCDA Office'},
      {agency_type: 'Department of justice'},
    ]),
  }
  const promiseObj = jasmine.createSpyObj('promiseObj', ['then'])

  describe('render', () => {
    describe('when mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
        component = mount(<CrossReportCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(component.find('CrossReportEditView').length).toEqual(1)
        expect(component.find('CrossReportEditView').props().allegations.toJS()).toEqual([
          {allegation_types: ['Exploitation', 'Severe neglect']},
          {allegation_types: ['General neglect']},
        ])
        expect(component.find('CrossReportEditView').props().crossReports.toJS()).toEqual([
          {agency_type: 'District attorney', agency_name: 'SCDA Office'},
          {agency_type: 'Department of justice'},
        ])
      })

      describe("when 'Cancel' is clicked", () => {
        beforeEach(() => {
          const cancelButton = component.find('button[children="Cancel"]')
          cancelButton.simulate('click')
        })

        it('the cross report show view is rendered', () => {
          expect(component.find('CrossReportShowView').props().crossReports.toJS()).toEqual([
            {agency_type: 'District attorney', agency_name: 'SCDA Office'},
            {agency_type: 'Department of justice'},
          ])
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

        it('the cross report show view is rendered', () => {
          expect(component.find('CrossReportShowView').length).toEqual(1)
        })
      })
    })

    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = mount(<CrossReportCardView {...props} mode='show'/>)
      })
      it('renders the cross report show card', () => {
        expect(component.find('CrossReportShowView').length).toEqual(1)
      })

      describe('when the user clicks edit link', () => {
        beforeEach(() => {
          const editLink = component.find('a[aria-label="Edit cross report"]')
          editLink.simulate('click')
        })

        it('it renders the cross report edit card', () => {
          expect(component.find('CrossReportEditView').length).toEqual(1)
        })
      })
    })
  })
})
