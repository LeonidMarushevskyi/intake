import CrossReportForm from 'screenings/CrossReportForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportForm', () => {
  function renderCrossReportForm({
    actions = {},
    alertInfoMessage = undefined,
    counties = [{id: '1234', name: 'County One'}],
    county_id = '',
    countyAgencies = {
      COMMUNITY_CARE_LICENSING: [],
      COUNTY_LICENSING: [],
      DEPARTMENT_OF_JUSTICE: [],
      DISTRICT_ATTORNEY: [],
      LAW_ENFORCEMENT: [],
    },
    districtAttorney = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    lawEnforcement = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    departmentOfJustice = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    countyLicensing = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    communityCareLicensing = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    inform_date = '',
    method = '',
    hasAgencies = false,
    screening = {},
    screeningWithEdits = {},
    toggleShow = () => null,
  }) {
    const props = {
      actions,
      alertInfoMessage,
      counties,
      county_id,
      countyAgencies,
      departmentOfJustice,
      districtAttorney,
      lawEnforcement,
      countyLicensing,
      communityCareLicensing,
      inform_date,
      method,
      hasAgencies,
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
  describe('inform_date', () => {
    it('does not render DateField if no agencies selected', () => {
      const component = renderCrossReportForm({hasAgencies: false, inform_date: '2017-02-20'})
      expect(component.find('DateField[id="cross_report_inform_date"]').exists()).toEqual(false)
    })
    it('passes the inform_date to DateField', () => {
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '2017-02-20'})
      expect(component.find('DateField[id="cross_report_inform_date"]').props().value).toEqual('2017-02-20')
      expect(component.find('DateField[id="cross_report_inform_date"]').props().hasTime).toEqual(false)
      expect(component.find('DateField[id="cross_report_inform_date"]').props().required).toEqual(true)
      expect(component.find('DateField[id="cross_report_inform_date"]').props().label).toEqual('Cross Reported on Date')
    })
    it('triggers the setField action on change', () => {
      const setField = jasmine.createSpy('setField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {setField}})
      component.find('DateField[id="cross_report_inform_date"]').simulate('change', {target: {value: '2016-01-23'}})
      expect(setField).toHaveBeenCalledWith('inform_date', '2016-01-23')
    })
    it('triggers the touchField action on blur', () => {
      const touchField = jasmine.createSpy('touchField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {touchField}})
      component.find('DateField[id="cross_report_inform_date"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('inform_date')
    })
  })
  describe('method', () => {
    const setField = jasmine.createSpy('setField')
    const touchField = jasmine.createSpy('touchField')
    it('does not render SelectField if no agencies selected', () => {
      const component = renderCrossReportForm({hasAgencies: false, method: '2017'})
      expect(component.find('SelectField[id="cross_report_method"]').exists()).toEqual(false)
    })
    it('passes the selected method to method pull down', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '1234'})
      expect(component.find('SelectField[id="cross_report_method"]').props().value).toEqual('1234')
    })
    it('triggers the setField action on change', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '', actions: {setField}})
      component.find('SelectField[id="cross_report_method"]').simulate('change', {target: {value: '1234'}})
      expect(setField).toHaveBeenCalledWith('method', '1234')
    })
    it('triggers the touchField action on blur', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '', actions: {touchField}})
      component.find('SelectField[id="cross_report_method"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('method')
    })
  })
  describe('agencies', () => {
    const setAgencyTypeField = jasmine.createSpy('setAgencyTypeField')
    const setAgencyField = jasmine.createSpy('setAgencyField')
    const touchField = jasmine.createSpy('touchField')
    const touchAgencyField = jasmine.createSpy('touchAgencyField')
    const clearAllAgencyFields = jasmine.createSpy('clearAllAgencyFields')
    const actions = {setAgencyField, setAgencyTypeField, touchAgencyField, touchField, clearAllAgencyFields}
    it('renders DISTRICT_ATTORNEY agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        districtAttorney: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [],
          DEPARTMENT_OF_JUSTICE: [],
          DISTRICT_ATTORNEY: [{id: '123', value: 'asdf'}],
          LAW_ENFORCEMENT: [],
        },
        actions,
      })
      expect(component.find('AgencyField[type="DISTRICT_ATTORNEY"]').props().selected).toEqual(true)
      expect(component.find('AgencyField[type="DISTRICT_ATTORNEY"]').props().value).toEqual('1234')
      expect(component.find('AgencyField[type="DISTRICT_ATTORNEY"]').props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(component.find('AgencyField[type="DISTRICT_ATTORNEY"]').props().actions).toEqual(actions)
    })
    it('renders LAW_ENFORCEMENT agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        lawEnforcement: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [],
          DEPARTMENT_OF_JUSTICE: [],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [{id: '123', value: 'asdf'}],
        },
        actions,
      })
      expect(component.find('AgencyField[type="LAW_ENFORCEMENT"]').props().selected).toEqual(true)
      expect(component.find('AgencyField[type="LAW_ENFORCEMENT"]').props().value).toEqual('1234')
      expect(component.find('AgencyField[type="LAW_ENFORCEMENT"]').props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(component.find('AgencyField[type="LAW_ENFORCEMENT"]').props().actions).toEqual(actions)
    })
    it('renders DEPARTMENT_OF_JUSTICE agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        departmentOfJustice: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [],
          DEPARTMENT_OF_JUSTICE: [{id: '123', value: 'asdf'}],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [],
        },
        actions,
      })
      expect(component.find('AgencyField[type="DEPARTMENT_OF_JUSTICE"]').props().selected).toEqual(true)
      expect(component.find('AgencyField[type="DEPARTMENT_OF_JUSTICE"]').props().value).toEqual('1234')
      expect(component.find('AgencyField[type="DEPARTMENT_OF_JUSTICE"]').props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(component.find('AgencyField[type="DEPARTMENT_OF_JUSTICE"]').props().actions).toEqual(actions)
    })
    it('renders COUNTY_LICENSING agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        countyLicensing: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [{id: '123', value: 'asdf'}],
          DEPARTMENT_OF_JUSTICE: [],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [],
        },
        actions,
      })
      expect(component.find('AgencyField[type="COUNTY_LICENSING"]').props().selected).toEqual(true)
      expect(component.find('AgencyField[type="COUNTY_LICENSING"]').props().value).toEqual('1234')
      expect(component.find('AgencyField[type="COUNTY_LICENSING"]').props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(component.find('AgencyField[type="COUNTY_LICENSING"]').props().actions).toEqual(actions)
    })
    it('renders COMMUNITY_CARE_LICENSING agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        communityCareLicensing: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [{id: '123', value: 'asdf'}],
          COUNTY_LICENSING: [],
          DEPARTMENT_OF_JUSTICE: [],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [],
        },
        actions,
      })
      expect(component.find('AgencyField[type="COMMUNITY_CARE_LICENSING"]').props().selected).toEqual(true)
      expect(component.find('AgencyField[type="COMMUNITY_CARE_LICENSING"]').props().value).toEqual('1234')
      expect(component.find('AgencyField[type="COMMUNITY_CARE_LICENSING"]').props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(component.find('AgencyField[type="COMMUNITY_CARE_LICENSING"]').props().actions).toEqual(actions)
    })
  })
  describe('county selection', () => {
    const clearAllFields = jasmine.createSpy('clearAllFields')
    const fetchCountyAgencies = jasmine.createSpy('fetchCountyAgencies')
    const setField = jasmine.createSpy('setField')
    const actions = {clearAllFields, fetchCountyAgencies, setField}
    it('passes the selected county to county pull down', () => {
      const component = renderCrossReportForm({county_id: '1234'})
      expect(component.find('CountySelectField[id="cross_report_county"]').props().value).toEqual('1234')
    })
    it('does not triggers the fetchCountyAgencies action on change if default value selected', () => {
      const component = renderCrossReportForm({actions})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: ''}})
      expect(fetchCountyAgencies).not.toHaveBeenCalled()
    })
    it('triggers the fetchCountyAgencies action on change', () => {
      const component = renderCrossReportForm({actions})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(fetchCountyAgencies).toHaveBeenCalledWith('1234')
    })
    it('triggers the setField action on change', () => {
      const component = renderCrossReportForm({actions})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(setField).toHaveBeenCalledWith('county_id', '1234')
    })
    it('triggers the clearAllFields action on change', () => {
      const component = renderCrossReportForm({actions})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(clearAllFields).toHaveBeenCalled()
    })
    it('triggers the touchField action on blur', () => {
      const touchField = jasmine.createSpy('touchField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {touchField}})
      component.find('CountySelectField[id="cross_report_county"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('county_id')
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
