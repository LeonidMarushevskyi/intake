import CrossReportAgencyField from 'views/CrossReportAgencyField'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportAgencyField', () => {
  function renderAgencyField({
    actions = {},
    countyAgencies = [],
    errors = [],
    type = '',
    required = false,
    selected = false,
    value = '',
  }) {
    const props = {
      actions,
      countyAgencies,
      errors,
      type,
      required,
      selected,
      value,
    }
    return shallow(<CrossReportAgencyField {...props} />, {disableLifecycleMethods: true})
  }

  it('renders errors', () => {
    const component = renderAgencyField({type: 'DISTRICT_ATTORNEY', errors: ['errors go here']})
    const errors = component.find('ErrorMessages')
    expect(errors.exists()).toEqual(true)
    expect(errors.props().errors).toEqual(['errors go here'])
  })
  it('renders the checkbox', () => {
    const component = renderAgencyField({type: 'DISTRICT_ATTORNEY', required: true})
    const checkbox = component.find('CheckboxField[id="type-DISTRICT_ATTORNEY"]')
    expect(checkbox.exists()).toEqual(true)
    expect(checkbox.props().checked).toEqual(false)
    expect(checkbox.props().disabled).toEqual(true)
    expect(checkbox.props().required).toEqual(true)
    expect(checkbox.props().label).toEqual('District attorney')
    expect(checkbox.props().value).toEqual('DISTRICT_ATTORNEY')
  })
  it('checkbox enalbed when agencies exist', () => {
    const component = renderAgencyField({
      type: 'DISTRICT_ATTORNEY',
      countyAgencies: [{id: '1234', value: 'DA Criminal Dept'}],
    })
    const checkbox = component.find('CheckboxField[id="type-DISTRICT_ATTORNEY"]')
    expect(checkbox.exists()).toEqual(true)
    expect(checkbox.props().disabled).toEqual(false)
  })
  it('triggers the appropriate actions on change', () => {
    const setAgencyTypeField = jasmine.createSpy('setAgencyTypeField')
    const touchField = jasmine.createSpy('touchField')
    const clearAllAgencyFields = jasmine.createSpy('clearAllAgencyFields')
    const actions = {clearAllAgencyFields, touchField, setAgencyTypeField}
    const component = renderAgencyField({type: 'DISTRICT_ATTORNEY', actions})
    component.find('CheckboxField[id="type-DISTRICT_ATTORNEY"]').simulate('change', {target: {checked: true}})
    expect(setAgencyTypeField).toHaveBeenCalledWith('DISTRICT_ATTORNEY', true)
    expect(touchField).toHaveBeenCalledWith('DISTRICT_ATTORNEY')
    expect(clearAllAgencyFields).toHaveBeenCalledWith('DISTRICT_ATTORNEY')
  })
  it('does not render the select field by default', () => {
    const component = renderAgencyField({type: 'DISTRICT_ATTORNEY'})
    expect(component.find('SelectField[id="DISTRICT_ATTORNEY-agency-code"]').exists()).toEqual(false)
  })
  describe('when selected', () => {
    const setAgencyField = jasmine.createSpy('setAgencyField')
    const touchAgencyField = jasmine.createSpy('touchAgencyField')
    it('triggers touchAgencyField on blur', () => {
      const component = renderAgencyField({
        actions: {
          setAgencyField,
          touchAgencyField,
        },
        type: 'LAW_ENFORCEMENT',
        countyAgencies: [
          {id: '1', name: 'Agency 1'},
          {id: '2', name: 'Agency 2'},
          {id: '3', name: 'Agency 3'},
        ],
        selected: true,
        value: '2',
      })
      const selectField = component.find('SelectField[id="LAW_ENFORCEMENT-agency-code"]')
      selectField.simulate('blur')
      expect(touchAgencyField).toHaveBeenCalledWith('LAW_ENFORCEMENT')
    })
    it('triggers setAgencyField & touchAgencyField on change', () => {
      const component = renderAgencyField({
        actions: {
          setAgencyField,
          touchAgencyField,
        },
        type: 'LAW_ENFORCEMENT',
        countyAgencies: [
          {id: '1', name: 'Agency 1'},
          {id: '2', name: 'Agency 2'},
          {id: '3', name: 'Agency 3'},
        ],
        selected: true,
        value: '2',
      })
      const selectField = component.find('SelectField[id="LAW_ENFORCEMENT-agency-code"]')
      selectField.simulate('change', {target: {value: '3'}})
      expect(setAgencyField).toHaveBeenCalledWith('LAW_ENFORCEMENT', '3')
      expect(touchAgencyField).toHaveBeenCalledWith('LAW_ENFORCEMENT')
    })
    it('does render the select field by default', () => {
      const countyAgencies = [
        {id: '1', name: 'Agency 1'},
        {id: '2', name: 'Agency 2'},
        {id: '3', name: 'Agency 3'},
      ]
      const component = renderAgencyField({
        type: 'LAW_ENFORCEMENT',
        countyAgencies,
        selected: true,
        value: '12345',
        errors: ['I has error'],
      })
      const selectField = component.find('SelectField[id="LAW_ENFORCEMENT-agency-code"]')
      expect(selectField.exists()).toEqual(true)
      expect(selectField.props().label).toEqual('Law enforcement agency name')
      expect(selectField.props().required).toEqual(true)
      expect(selectField.props().value).toEqual('12345')
      expect(selectField.props().gridClassName).toEqual('input-error')
      const children = selectField.props().children[1]
      expect(children[0].key).toEqual('1')
      expect(children[0].props.value).toEqual('1')
      expect(children[0].props.children).toEqual('Agency 1')
      expect(children[1].key).toEqual('2')
      expect(children[1].props.value).toEqual('2')
      expect(children[1].props.children).toEqual('Agency 2')
      expect(children[2].key).toEqual('3')
      expect(children[2].props.value).toEqual('3')
      expect(children[2].props.children).toEqual('Agency 3')
    })
  })
})
