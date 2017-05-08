import CrossReportShowView from 'components/screenings/CrossReportShowView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    component = shallow(<CrossReportShowView crossReport={Immutable.List()} onEdit={onEdit} />)
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
    const crossReport = Immutable.List([
      {agency_type: 'District of attorney', agency_name: 'SCDA'},
      {agency_type: 'Licensing'},
    ])
    const component = shallow(<CrossReportShowView crossReport={crossReport} onEdit={onEdit} />)
    expect(component.find('ShowField[label="Cross reported to"]').html())
      .toContain('District of attorney - SCDA')
    expect(component.find('ShowField[label="Cross reported to"]').html())
      .toContain('Licensing')
  })

  it('does not renders when the cross report is empty ', () => {
    const crossReport = Immutable.List([])
    const component = shallow(<CrossReportShowView crossReport={crossReport} onEdit={onEdit} />)
    expect(component.find('ShowField[label="Cross reported to"]').html()).not.toContain('District of attorney')
    expect(component.find('ShowField[label="Cross reported to"]').html()).not.toContain('Licensing')
  })
})
