import CrossReportShowView from 'screenings/CrossReportShowView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    const props = {
      agencyCodeToName: {code123: 'Name of Agency'},
      crossReports: Immutable.List(),
      onEdit: onEdit,
      errors: Immutable.Map(),
    }
    component = shallow(<CrossReportShowView {...props} />)
  })

  describe('Alert info messages', () => {
    it('renders an alert info message when passed', () => {
      component.setProps({alertInfoMessage: 'Help me, Obi-Wan Kenobi!'})
      expect(component.find('AlertInfoMessage').exists()).toEqual(true)
      expect(component.find('AlertInfoMessage').html()).toContain('Help me, Obi-Wan Kenobi!')
    })

    it('does not render an alert info message when none are present', () => {
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
  })

  describe('when cross reports are present', () => {
    let component
    beforeEach(() => {
      const props = {
        crossReports: Immutable.List([
          {county: '123', agency_type: 'District attorney', agency_code: 'AGENCYCODE', reported_on: '2017-01-15'},
          {county: '123', agency_type: 'Licensing'},
        ]),
        errors: Immutable.fromJS({
          Licensing: {agency_code: ['Error 1'], communication_method: ['Error 2']},
          'District attorney': {reported_on: ['Error 3']},
        }),
        agencyCodeToName: {AGENCYCODE: 'District attorney - SCDA'},
        onEdit: onEdit,
      }
      component = shallow(<CrossReportShowView {...props} />)
    })

    it('renders the cross report agencies', () => {
      expect(component.find('ShowField[label="This report has cross reported to:"]').length).toEqual(1)
      expect(component.html()).toContain('District attorney - SCDA')
      expect(component.html()).toContain('Licensing')
    })

    it('renders the reported on field as required', () => {
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.html()).toContain('1/15/2017')
      expect(field.props().required).toEqual(true)
    })

    it('renders the communication method field as required', () => {
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.props().required).toEqual(true)
    })

    it('renders errors for Licensing.agency_code', () => {
      expect(component.find('ShowField[label="This report has cross reported to:"]').html())
        .toContain('Error 1')
    })

    it('renders an error for communication_method', () => {
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.props().errors).toEqual(['Error 2'])
    })

    it('renders an error for reported_on', () => {
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.props().errors).toEqual(['Error 3'])
    })
  })

  describe('when cross reports are not present', () => {
    it("doesn't render the cross report agencies", () => {
      expect(component.html()).not.toContain('District of attorney')
      expect(component.html()).not.toContain('Licensing')
    })

    it("doesn't render the reported on field", () => {
      expect(component.find('ShowField[label="Cross Reported on Date"]').length).toEqual(0)
    })

    it("doesn't render the communication method field", () => {
      expect(component.find('ShowField[label="Communication Method"]').length).toEqual(0)
    })
  })
})
