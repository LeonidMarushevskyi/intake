import CrossReportCardView from 'screenings/crossReports/CrossReportCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportCardView', () => {
  let component
  let promiseObj

  const fetchCountyAgencies = jasmine.createSpy('fetchCountyAgencies')
  const props = {
    areCrossReportsRequired: true,
    actions: {fetchCountyAgencies},
    crossReports: Immutable.fromJS([
      {county: '123', agency_type: 'DISTRICT_ATTORNEY', agency_code: '1234'},
      {county: '123', agency_type: 'DEPARTMENT_OF_JUSTICE'},
    ]),
    editable: true,
  }
  beforeEach(() => {
    props.onEdit = jasmine.createSpy()
    promiseObj = jasmine.createSpyObj('promiseObj', ['then'])
    props.onCancel = jasmine.createSpy()
    props.onChange = jasmine.createSpy()
    props.onSave = jasmine.createSpy()
  })

  it('renders the card header', () => {
    const component = shallow(<CrossReportCardView {...props} mode='edit' />)
    const header = component.find('ScreeningCardHeader')
    expect(header.length).toEqual(1)
    expect(header.props().onEdit).toEqual(component.instance().onEdit)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Cross Report')
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

  describe('alertInfoMessage', () => {
    it('returns null when cross reports are not required', () => {
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          areCrossReportsRequired={false}
        />
      )
      expect(component.instance().alertInfoMessage()).toEqual(null)
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
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations (except General Neglect, Caretaker Absence, or "At risk, sibling abused")')
    })

    it('returns a message when cross reports are required but district attorney has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'LAW_ENFORCEMENT'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations (except General Neglect, Caretaker Absence, or "At risk, sibling abused")')
    })

    it('returns a message when cross reports are required but law enforcement has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'DISTRICT_ATTORNEY'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations (except General Neglect, Caretaker Absence, or "At risk, sibling abused")')
    })

    it('returns a message when cross reports are required, and law enforcement and D.A. have both been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'DISTRICT_ATTORNEY'}, {agency_type: 'LAW_ENFORCEMENT'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toEqual(null)
    })
  })

  describe('render', () => {
    describe('when mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
        component = shallow(<CrossReportCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(component.find('Connect(CrossReportForm)').exists()).toEqual(true)
        expect(component.find('Connect(CrossReportForm)').props().toggleShow).toEqual(component.instance().toggleShow)
        // TODO: expect(component.find('CrossReportEditView').props().isAgencyRequired).toEqual(jasmine.any(Function))
      })

      describe('isAgencyRequired', () => {
        it('returns true if the agency is required and cross reporting is required', () => {
          expect(component.instance().isAgencyRequired('DISTRICT_ATTORNEY')).toEqual(true)
          expect(component.instance().isAgencyRequired('LAW_ENFORCEMENT')).toEqual(true)
        })

        it('returns false if an agency is not required even if cross reporting is required', () => {
          expect(component.instance().isAgencyRequired('COUNTY_LICENSING')).toEqual(false)
        })

        it('returns false if cross reporting is not required', () => {
          component = shallow(<CrossReportCardView {...props} mode='edit' areCrossReportsRequired={false}/>)
          expect(component.instance().isAgencyRequired('DISTRICT_ATTORNEY')).toEqual(false)
        })
      })

      describe('isAgencyChecked', () => {
        beforeEach(() => {
          component = shallow(
            <CrossReportCardView {...props}
              crossReports={Immutable.fromJS([
                {agency_type: 'Law enforcement'},
              ])}
              mode='edit'
            />
          )
        })
        it('returns true if agency is checked', () => {
          expect(component.instance().isAgencyChecked('Law enforcement')).toEqual(true)
        })
        it('returns false if agency is NOT checked', () => {
          expect(component.instance().isAgencyChecked('District attorney')).toEqual(false)
        })
      })
    })

    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = shallow(<CrossReportCardView {...props} mode='show'/>)
      })

      it('renders the cross report show card', () => {
        expect(component.find('Connect(CrossReportShow)').exists()).toEqual(true)
      })
    })
  })
})
