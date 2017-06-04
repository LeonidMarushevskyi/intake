import CrossReportShowView from 'components/screenings/CrossReportShowView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    component = shallow(<CrossReportShowView crossReports={Immutable.List()} onEdit={onEdit} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card.show .card-header').text()).toContain('Cross Report')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit cross report')
  })

  describe('clicking the edit link', () => {
    beforeEach(() => {
      component.find('EditLink').simulate('click')
    })
    it('switches to edit mode when edit icon is clicked', () => {
      expect(onEdit).toHaveBeenCalled()
    })
  })

  describe('when cross reports are present', () => {
    let component
    beforeEach(() => {
      const crossReports = Immutable.List([
        {agency_type: 'District of attorney', agency_name: 'SCDA', reported_on: '2017-01-15', communication_method: 'Electronic Report'},
        {agency_type: 'Licensing'},
      ])
      component = shallow(<CrossReportShowView crossReports={crossReports} onEdit={onEdit} />)
    })

    it('renders the cross report agencies', () => {
      expect(component.find('ShowField[label="This report has cross reported to:"]').length).toEqual(1)
      expect(component.html()).toContain('District of attorney - SCDA')
      expect(component.html()).toContain('Licensing')
    })
  })

  describe('when cross reports are not present', () => {
    let component
    beforeEach(() => {
      const crossReports = Immutable.List()
      component = shallow(<CrossReportShowView crossReports={crossReports} onEdit={onEdit} />)
    })

    it("doesn't render the cross report agencies", () => {
      expect(component.html()).not.toContain('District of attorney')
      expect(component.html()).not.toContain('Licensing')
    })
  })
})
