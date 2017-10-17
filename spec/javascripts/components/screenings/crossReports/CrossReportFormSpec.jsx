import CrossReportForm from 'screenings/CrossReportForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportForm', () => {
  function renderCrossReportForm({
    actions = {},
    alertInfoMessage = undefined,
    counties = [{id: '1234', name: 'County One'}],
    county_id = '',
    screening = {},
    screeningWithEdits = {},
    toggleShow = () => null,
  }) {
    const props = {
      actions,
      alertInfoMessage,
      counties,
      county_id,
      screening,
      screeningWithEdits,
      toggleShow,
    }
    return shallow(<CrossReportForm {...props} />)
  }
  it('renders the label', () => {
    const component = renderCrossReportForm({})
    expect(component.find('div label').html()).toContain('This report has cross reported to:')
  })
  describe('county selection', () => {
    const fetchCountyAgencies = jasmine.createSpy('fetchCountyAgencies')
    const setField = jasmine.createSpy('setField')
    it('passes the selected county to county pull down', () => {
      const component = renderCrossReportForm({county_id: '1234'})
      expect(component.find('CountySelectField[id="cross_report_county"]').props().value).toEqual('1234')
    })
    it('triggers the fetchCountyAgencies action on change', () => {
      const component = renderCrossReportForm({actions: {fetchCountyAgencies, setField}})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(fetchCountyAgencies).toHaveBeenCalledWith('1234')
    })
    it('triggers the setField action on change', () => {
      const component = renderCrossReportForm({actions: {fetchCountyAgencies, setField}})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(setField).toHaveBeenCalledWith('county_id', '1234')
    })
  })
  describe('Alert info messages', () => {
    it('renders an alert info message when passed', () => {
      const component = renderCrossReportForm({alertInfoMessage: 'Help me, Obi-Wan Kenobi!'})
      expect(component.find('AlertInfoMessage').exists()).toEqual(true)
      expect(component.find('AlertInfoMessage').props().message).toEqual('Help me, Obi-Wan Kenobi!')
    })
    it('does not render an alert info message when none are present', () => {
      const component = renderCrossReportForm({})
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
  })
  it('displays the save and cancel button', () => {
    const component = renderCrossReportForm({})
    const saveButton = component.find('button.btn-primary')
    expect(saveButton.text()).toContain('Save')
    const cancelButton = component.find('button.btn-default')
    expect(cancelButton.text()).toContain('Cancel')
  })
  describe('clicking on cancel', () => {
    it('fires toggleShow, resetFieldValues', () => {
      const screening = {cross_reports: [{type: 'COUNTY_LICENSING'}]}
      const toggleShow = jasmine.createSpy('toggleShow')
      const resetFieldValues = jasmine.createSpy('resetFieldValues')
      const component = renderCrossReportForm({actions: {resetFieldValues}, screening, toggleShow})
      component.find('.btn.btn-default').simulate('click')
      expect(toggleShow).toHaveBeenCalledWith()
      expect(resetFieldValues).toHaveBeenCalledWith(screening)
    })
  })
  describe('clicking on save', () => {
    it('fires toggleShow, saveScreening', () => {
      const saveScreening = jasmine.createSpy('saveScreening')
      const toggleShow = jasmine.createSpy('toggleShow')
      const screeningWithEdits = {id: 123, crossReports: []}
      const component = renderCrossReportForm({actions: {saveScreening}, screeningWithEdits, toggleShow})
      component.find('button.btn-primary').simulate('click')
      expect(saveScreening).toHaveBeenCalledWith(screeningWithEdits)
      expect(toggleShow).toHaveBeenCalledWith()
    })
  })
})
