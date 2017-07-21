import CrossReportCardView from 'components/screenings/CrossReportCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('CrossReportCardView', () => {
  let component
  let promiseObj
  const props = {
    areCrossReportsRequired: true,
    crossReports: Immutable.fromJS([
      {agency_type: 'District attorney', agency_name: 'SCDA Office'},
      {agency_type: 'Department of justice'},
    ]),
  }
  beforeEach(() => {
    props.onEdit = jasmine.createSpy()
    promiseObj = jasmine.createSpyObj('promiseObj', ['then'])
    props.onCancel = jasmine.createSpy()
    props.onChange = jasmine.createSpy()
    props.onSave = jasmine.createSpy()
  })

  describe('crossReportsInclude', () => {
    it('returns true if cross reports includes the agency type passed', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}])
      const component = shallow(<CrossReportCardView {...props} mode='show' crossReports={crossReports} />)
      expect(component.instance().crossReportsInclude('District attorney')).toEqual(true)
    })

    it('returns false if cross reports do not include the agency type passed', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'Disctrict attorney'}])
      const component = shallow(<CrossReportCardView {...props} mode='show' crossReports={crossReports} />)
      expect(component.instance().crossReportsInclude('Law enforcement')).toEqual(false)
    })
  })

  describe('infoMessage', () => {
    it('returns null when cross reports are not required', () => {
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          areCrossReportsRequired={false}
        />
      )
      expect(component.instance().infoMessage()).toEqual(null)
    })

    it('returns a message when cross reports are required and none have been selected', () => {
      const crossReports = Immutable.List()
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().infoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required but district attorney has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'Law enforcement'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().infoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required but law enforcement has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().infoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required, and law enforcement and D.A. have both been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}, {agency_type: 'Law enforcement'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().infoMessage()).toEqual(null)
    })
  })

  describe('render', () => {
    describe('when mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
        component = mount(<CrossReportCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(component.find('CrossReportEditView').length).toEqual(1)
        expect(component.find('CrossReportEditView').props().areCrossReportsRequired).toEqual(true)
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

        it('renders the cross report show view', () => {
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
