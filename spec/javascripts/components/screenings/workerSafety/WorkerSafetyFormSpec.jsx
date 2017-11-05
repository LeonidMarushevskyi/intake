import WorkerSafetyForm from 'screenings/workerSafety/WorkerSafetyForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyForm', () => {
  function renderWorkerSafety({
    safetyAlerts = {value: []},
    safetyInformation = {value: ''},
    alertOptions = [],
    onChange,
    onBlur,
    onCancel,
    onSave,
  }) {
    const props = {
      alertOptions,
      safetyAlerts,
      safetyInformation,
      onChange,
      onBlur,
      onCancel,
      onSave,
    }
    return shallow(<WorkerSafetyForm {...props} />)
  }

  it('displays the worker safety alerts', () => {
    const component = renderWorkerSafety({
      safetyAlerts: {value: ['1']},
    })
    const safetyAlertField = component.find('Select[multi]')
    expect(safetyAlertField.length).toEqual(1)
    expect(safetyAlertField.props().value).toEqual(['1'])
  })

  it('displays the additional safety information', () => {
    const component = renderWorkerSafety({safetyInformation: {value: 'something dangerous'}})
    const safetyInformationField = component.find('textarea')
    expect(safetyInformationField.props().value).toEqual('something dangerous')
  })

  it('calls onChange when the safety alerts change', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderWorkerSafety({onChange})
    const newSelectedSafetyAlerts = [
      {label: 'Firearms in Home', value: 'Firearms in Home'},
      {label: 'Hostile, Aggressive Client', value: 'Hostile, Aggressive Client'},
    ]
    component.find('Select[multi]').simulate('Change', newSelectedSafetyAlerts)
    expect(onChange).toHaveBeenCalledWith(
      'safety_alerts',
      ['Firearms in Home', 'Hostile, Aggressive Client']
    )
  })

  it('calls onChange when the additional safety information changes', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderWorkerSafety({onChange})
    component.find('textarea').simulate('change', {target: {value: 'something dangerous'}})
    expect(onChange).toHaveBeenCalledWith('safety_information', 'something dangerous')
  })

  it('blurring worker safety alerts calls onBlur with the proper parameter', () => {
    const onBlur = jasmine.createSpy('onBlur')
    const component = renderWorkerSafety({onBlur})
    component.find('Select[multi]').simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('safety_alerts')
  })

  it('blurring additional safety information calls onBlur with the proper parameter', () => {
    const onBlur = jasmine.createSpy('onBlur')
    const component = renderWorkerSafety({onBlur})
    component.find('textarea').simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('safety_information')
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderWorkerSafety({onCancel})
    component.find('.btn.btn-default').simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderWorkerSafety({onSave})
    component.find('.btn.btn-primary').simulate('click')
    expect(onSave).toHaveBeenCalled()
  })
})
