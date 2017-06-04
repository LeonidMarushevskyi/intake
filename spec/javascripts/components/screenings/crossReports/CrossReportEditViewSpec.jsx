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
    }
    component = shallow(<CrossReportEditView {...props}/>)
  })

  it('renders the card title', () => {
    expect(component.find('.card.edit .card-header').text()).toEqual('Cross Report')
  })
  it('renders the display label', () => {
    expect(component.find('.card-body').text()).toContain('This report has cross reported to:')
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
          {agency_type: 'Department of justice'},
          {agency_type: 'Law enforcement'},
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

    it('renders Reported on date field', () => {
      expect(component.find('DateField').length).toEqual(1)
    })

    it('renders Communication method select field', () => {
      expect(component.find('SelectField').length).toEqual(1)
    })

    it('updates all cross reports reported on when Reported on is changed', () => {
      const reportedOnField = component.find('DateField')
      reportedOnField.simulate('change', {target: {value: '1999/01/01'}})
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', reported_on: '1999/01/01'},
        {agency_type: 'Law enforcement', reported_on: '1999/01/01'},
      ])
    })

    it('updates all cross reports communication method when communication method is changed', () => {
      const communicationMethodField = component.find('SelectField')
      communicationMethodField.simulate('change', {target: {value: 'Child Abuse Form'}})
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice', communication_method: 'Child Abuse Form'},
        {agency_type: 'Law enforcement', communication_method: 'Child Abuse Form'},
      ])
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

  describe('checkboxes', () => {
    it('when checked and calls onChange with new agency', () => {
      const checkbox = component.find('CheckboxField[value="Law enforcement"]')
      checkbox.simulate('change', {target: {checked: true}})
      expect(props.onChange).toHaveBeenCalled()
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'District attorney', agency_name: 'SCDA Office'},
        {agency_type: 'Department of justice'},
        {agency_type: 'Law enforcement'},
      ])
    })

    it('when unchecked calls onChange', () => {
      const uncheck = component.find('CheckboxField[value="District attorney"]')
      uncheck.simulate('change', {target: {checked: false}})
      expect(props.onChange).toHaveBeenCalled()
      expect(props.onChange.calls.argsFor(0)[1].toJS()).toEqual([
        {agency_type: 'Department of justice'},
      ])
    })
  })
})
