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
    expect(component.find('.card-body').text()).toContain('Cross reported to')
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
