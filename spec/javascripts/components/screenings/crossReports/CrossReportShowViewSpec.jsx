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

  it('renders the show fields', () => {
    const crossReports = Immutable.List([
      {agency_type: 'District of attorney', agency_name: 'SCDA'},
      {agency_type: 'Licensing'},
    ])
    const component = shallow(<CrossReportShowView crossReports={crossReports} onEdit={onEdit} />)
    expect(component.find('ShowField[label="This report has cross reported to:"]').length).toEqual(1)
    expect(component.html()).toContain('District of attorney - SCDA')
    expect(component.html()).toContain('Licensing')
  })

  it('does not renders when the cross report is empty ', () => {
    const crossReports = Immutable.List([])
    const component = shallow(<CrossReportShowView crossReports={crossReports} onEdit={onEdit} />)
    expect(component.html()).not.toContain('District of attorney')
    expect(component.html()).not.toContain('Licensing')
  })
})
