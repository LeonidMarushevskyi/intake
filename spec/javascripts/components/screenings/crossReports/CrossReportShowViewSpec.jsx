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

  describe('Info messages', () => {
    it('renders an info message when passed', () => {
      component.setProps({infoMessage: 'Help me, Obi-Wan Kenobi!'})
      expect(component.find('InfoMessage').exists()).toEqual(true)
      expect(component.find('InfoMessage').html()).toContain('Help me, Obi-Wan Kenobi!')
    })

    it('does not render an info message when none are present', () => {
      expect(component.find('InfoMessage').exists()).toEqual(false)
    })
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

    it('renders the reported on field as required', () => {
      const field = component.find('ShowField[label="Cross Reported on Date"]')
      expect(field.html()).toContain('1/15/2017')
      expect(field.props().required).toEqual(true)
    })

    it('renders the communication method field as required', () => {
      const field = component.find('ShowField[label="Communication Method"]')
      expect(field.html()).toContain('Electronic Report')
      expect(field.props().required).toEqual(true)
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

    it("doesn't render the reported on field", () => {
      expect(component.find('ShowField[label="Cross Reported on Date"]').length).toEqual(0)
    })

    it("doesn't render the communication method field", () => {
      expect(component.find('ShowField[label="Communication Method"]').length).toEqual(0)
    })
  })
})
