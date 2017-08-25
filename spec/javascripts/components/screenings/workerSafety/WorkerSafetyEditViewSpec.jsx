import WorkerSafetyEditView from 'screenings/WorkerSafetyEditView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyEditView', () => {
  let component
  let onCancel
  let onChange
  let onSave

  beforeEach(() => {
    onCancel = jasmine.createSpy('onCancel')
    onSave = jasmine.createSpy('onSave')
    onChange = jasmine.createSpy('onChange')
    component = shallow(
      <WorkerSafetyEditView
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
        safetyInformation={'Be careful!'}
        safetyAlerts={Immutable.fromJS(['Gang Affiliation or Gang Activity'])}
      />
    )
  })
  it('renders worker card header', () => {
    expect(component.find('.card-header').text()).toContain('Worker Safety')
  })

  it('renders the correct options', () => {
    expect(component.find('Select[multi]').props().options).toEqual([
      {label: 'Dangerous Animal on Premises', value: 'Dangerous Animal on Premises'},
      {label: 'Dangerous Environment', value: 'Dangerous Environment'},
      {label: 'Firearms in Home', value: 'Firearms in Home'},
      {label: 'Gang Affiliation or Gang Activity', value: 'Gang Affiliation or Gang Activity'},
      {label: 'Hostile, Aggressive Client', value: 'Hostile, Aggressive Client'},
      {label: 'Remote or Isolated Location', value: 'Remote or Isolated Location'},
      {label: 'Severe Mental Health Status', value: 'Severe Mental Health Status'},
      {label: 'Threat or Assault on Staff Member', value: 'Threat or Assault on Staff Member'},
      {label: 'Other', value: 'Other'},
    ])
  })

  it('renders the worker safety edit fields', () => {
    expect(component.find('Select[multi]').length).toEqual(1)
    expect(component.find('Select[multi]').props().inputProps.id).toEqual('safety_alerts')
    expect(component.find('Select[multi]').props().value).toEqual(['Gang Affiliation or Gang Activity'])
  })

  it('renders the additional safety field', () => {
    expect(component.find('label[htmlFor="safety_information"]').text()).toEqual('Additional safety information')
    expect(component.find('textarea').props().value).toEqual('Be careful!')
  })
  it('renders save/cancel buttons', () => {
    expect(component.find('button.btn-primary').text()).toEqual('Save')
    expect(component.find('button.btn-default').text()).toEqual('Cancel')
  })
  it('calls onSave when the form is submitted', () => {
    const saveButton = component.find('button.btn-primary')
    saveButton.simulate('click')
    expect(onSave).toHaveBeenCalledWith()
  })

  it('calls onChange when the additional safety information is changed', () => {
    const narrative = component.find('#safety_information')
    narrative.simulate('change', {target: {value: 'Bad things happen'}})
    expect(onChange).toHaveBeenCalledWith(['safety_information'], 'Bad things happen')
  })

  it('calls onChange when the safety alerts are changed', () => {
    const newSelectedSafetyAlerts = [
      {label: 'Firearms in Home', value: 'Firearms in Home'},
      {label: 'Hostile, Aggressive Client', value: 'Hostile, Aggressive Client'},
    ]
    component.find('Select[multi]').simulate('Change', newSelectedSafetyAlerts)
    expect(onChange).toHaveBeenCalledWith(
      ['safety_alerts'],
      Immutable.List(['Firearms in Home', 'Hostile, Aggressive Client'])
    )
  })

  it('calls onCancel when the form is cancelled', () => {
    const cancelButton = component.find('.btn.btn-default')
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalledWith()
  })
})
