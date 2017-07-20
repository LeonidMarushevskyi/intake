import CrossReportEditView from 'components/screenings/CrossReportEditView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportEditView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      crossReports: Immutable.fromJS([
        {agency_type: 'District attorney', agency_name: 'SCDA Office'},
        {agency_type: 'Department of justice'},
      ]),
      onChange: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      areCrossReportsRequired: true,
    }
    component = shallow(<CrossReportEditView {...props}/>)
  })

  it('renders the card title and cross reported label', () => {
    expect(component.find('.card.edit .card-header').text()).toEqual('Cross Report')
    expect(component.find('.card-body').text()).toContain('This report has cross reported to:')
  })

  describe('Interaction with Allegations Card', () => {
    it('marks labels as required', () => {
      expect(component.find('CheckboxField[value="District attorney"]').props().required)
        .toBeTruthy()
      expect(component.find('CheckboxField[value="Law enforcement"]').props().required)
        .toBeTruthy()
    })

    it('renders a help message when cross reports are required', () => {
      expect(component.find('HelpMessage').exists()).toEqual(true)
      expect(component.find('HelpMessage').html()).toContain('Any report that includes allegations')
    })

    it('does not mark labels required when not required', () => {
      component.setProps({areCrossReportsRequired: false})
      expect(component.find('CheckboxField[value="District attorney"]').props().required)
        .toBeFalsy()
      expect(component.find('CheckboxField[value="Law enforcement"]').props().required)
        .toBeFalsy()
    })

    it('does not render a help message when cross reports are not required', () => {
      component.setProps({areCrossReportsRequired: false})
      expect(component.find('HelpMessage').exists()).toEqual(false)
    })
  })

  describe('isAgencyRequired', () => {
    it('returns true if the agency is required and cross reporting is required', () => {
      expect(component.instance().isAgencyRequired('District attorney', true)).toEqual(true)
    })

    it('returns false if an agency is not required even if cross reporting is required', () => {
      expect(component.instance().isAgencyRequired('Licensing', true)).toEqual(false)
    })

    it('returns false if cross reporting is not required', () => {
      expect(component.instance().isAgencyRequired('District attorney', false)).toEqual(false)
    })
  })

  it('renders labels for required field as required', () => {
    component.find('#type-District_attorney').simulate('click')
    expect(component.find('InputField[label="District attorney agency name"]').props().required)
        .toEqual(true)
    expect(component.find('DateField[label="Cross Reported on Date"]').props().required)
        .toEqual(true)
    expect(component.find('SelectField[label="Communication Method"]').props().required)
        .toEqual(true)
  })

  it('renders the checkboxes', () => {
    const checkboxes = component.find('CheckboxField')
    expect(checkboxes.length).toEqual(4)
    expect(checkboxes.nodes.map((checkbox) => checkbox.props.value)).toEqual([
      'District attorney',
      'Law enforcement',
      'Department of justice',
      'Licensing',
    ])
  })

  it('renders the save and cancel buttons', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  describe('when an agency is selected', () => {
    beforeEach(() => {
      props = {
        crossReports: Immutable.fromJS([
          {agency_type: 'Department of justice', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
          {agency_type: 'Law enforcement', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
        ]),
        onChange: jasmine.createSpy(),
        onSave: () => null,
        onCancel: () => null,
      }
      component = shallow(<CrossReportEditView {...props}/>)
    })

    it('renders the Communication Time and Method legend', () => {
      expect(component.find('legend').text()).toContain('Communication Time and Method')
    })

    it('renders Reported on date field with the first cross reports reported on value', () => {
      expect(component.find('DateField').length).toEqual(1)
      expect(component.find('DateField').props().value).toEqual('2011-02-13')
    })

    it('renders Communication method select field with the first cross reports reported on value', () => {
      expect(component.find('SelectField').length).toEqual(1)
      expect(component.find('SelectField').props().value).toEqual('Child Abuse Form')
    })

    it("updates cross reports 'reported on' when 'reported on' is changed", () => {
      const reportedOnField = component.find('DateField')
      const newReportedOn = '1999/01/01'
      reportedOnField.simulate('change', newReportedOn)
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', reported_on: newReportedOn, communication_method: 'Child Abuse Form'},
        {agency_type: 'Law enforcement', reported_on: newReportedOn, communication_method: 'Child Abuse Form'},
      ])
    })

    it("updates cross reports 'communication method' when 'communication method' is changed", () => {
      const communicationMethodField = component.find('SelectField')
      const newCommunicationMethod = 'Electronic Report'
      communicationMethodField.simulate('change', {target: {value: newCommunicationMethod}})
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', reported_on: '2011-02-13', communication_method: newCommunicationMethod},
        {agency_type: 'Law enforcement', reported_on: '2011-02-13', communication_method: newCommunicationMethod},
      ])
    })

    it('adds new cross report agency when a new agency is checked', () => {
      const checkbox = component.find('CheckboxField[value="District attorney"]')
      checkbox.simulate('change', {target: {checked: true}})
      expect(props.onChange).toHaveBeenCalled()
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
        {agency_type: 'Law enforcement', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
        {agency_type: 'District attorney', agency_name: null, reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
      ])
    })

    it('removes cross reports agency when an agency is unchecked', () => {
      const uncheck = component.find('CheckboxField[value="Department of justice"]')
      uncheck.simulate('change', {target: {checked: false}})
      expect(props.onChange).toHaveBeenCalled()
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Law enforcement', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
      ])
    })

    it('changes existing cross reports agency name when agency name is changed', () => {
      const input = component.find('InputField[label="Department of justice agency name"]')
      input.simulate('change', {target: {value: 'DoJ Office'}})
      expect(props.onChange).toHaveBeenCalled()
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', agency_name: 'DoJ Office', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
        {agency_type: 'Law enforcement', reported_on: '2011-02-13', communication_method: 'Child Abuse Form'},
      ])
    })
  })

  describe('caching communication and date data when an agency is selected', () => {
    beforeEach(() => {
      props = {
        crossReports: Immutable.fromJS([{
          agency_type: 'Department of justice',
          agency_name: null,
          reported_on: null,
          communication_method: null,
        }]),
        onChange: jasmine.createSpy('onChange'),
        onSave: () => null,
        onCancel: () => null,
      }
      component = shallow(<CrossReportEditView {...props}/>)
    })

    describe('when user selects a communication method, then de-selects agency', () => {
      beforeEach(() => {
        component.find('SelectField').simulate('change', {target: {value: 'Electronic Report'}})
        component.find('CheckboxField[value="Department of justice"]')
          .simulate('change', {target: {checked: false}})
        component.setProps({crossReports: Immutable.fromJS([])})
      })

      it('adds agency with cached communication method when user selects an agency', () => {
        component.find('CheckboxField[value="Law enforcement"]')
          .simulate('change', {target: {checked: true}})
        expect(props.onChange.calls.mostRecent().args[1].toJS()).toEqual([{
          agency_type: 'Law enforcement',
          agency_name: null,
          reported_on: null,
          communication_method: 'Electronic Report',
        }])
      })
    })

    describe('when user adds a reported on, then de-selects agency', () => {
      beforeEach(() => {
        component.find('DateField').simulate('change', '2011-05-09')
        component.find('CheckboxField[value="Department of justice"]')
          .simulate('change', {target: {checked: false}})
        component.setProps({crossReports: Immutable.fromJS([])})
      })

      it('adds agency with cached reported on when user selects an agency', () => {
        component.find('CheckboxField[value="Law enforcement"]')
          .simulate('change', {target: {checked: true}})
        expect(props.onChange.calls.mostRecent().args[1].toJS()).toEqual([{
          agency_type: 'Law enforcement',
          agency_name: null,
          reported_on: '2011-05-09',
          communication_method: null,
        }])
      })
    })

    describe('when user selects a communication method and reported on, then de-selects agency', () => {
      beforeEach(() => {
        component.find('SelectField').simulate('change', {target: {value: 'Electronic Report'}})
        component.find('DateField').simulate('change', '2011-05-09')
        component.find('CheckboxField[value="Department of justice"]')
          .simulate('change', {target: {checked: false}})
        component.setProps({crossReports: Immutable.fromJS([])})
      })

      it('adds agency with cached communication method and reported on when user selects an agency', () => {
        component.find('CheckboxField[value="Law enforcement"]')
          .simulate('change', {target: {checked: true}})
        expect(props.onChange.calls.mostRecent().args[1].toJS()).toEqual([{
          agency_type: 'Law enforcement',
          agency_name: null,
          reported_on: '2011-05-09',
          communication_method: 'Electronic Report',
        }])
      })
    })
  })

  describe('when no agency is selected', () => {
    beforeEach(() => {
      props = {
        crossReports: Immutable.fromJS([]),
        onChange: () => null,
        onSave: () => null,
        onCancel: () => null,
      }
      component = shallow(<CrossReportEditView {...props}/>)
    })

    it("doesn't render the Communication Time and Method legend", () => {
      expect(component.text()).not.toContain('Communication Time and Method')
    })

    it("doesn't render Reported on date field", () => {
      expect(component.find('DateField').length).toEqual(0)
    })

    it("doesn't render Communication method select field", () => {
      expect(component.find('Select').length).toEqual(0)
    })
  })

  it('preselect cross report details passed to props', () => {
    expect(component.find('CheckboxField[value="District attorney"]').props().checked).toEqual(true)
    expect(component.find('CheckboxField[value="Department of justice"]').props().checked).toEqual(true)
    expect(component.find('InputField').length).toEqual(2)
    expect(component.find('InputField[id="District_attorney-agency-name"]').props().value).toEqual('SCDA Office')
    expect(component.find('InputField[id="Department_of_justice-agency-name"]').props().value).toEqual('')
  })

  it('calls onSave', () => {
    component.find('.btn.btn-primary').simulate('click')
    expect(props.onSave).toHaveBeenCalled()
  })

  it('calls onCancel', () => {
    component.find('.btn.btn-default').simulate('click')
    expect(props.onCancel).toHaveBeenCalled()
  })
})
