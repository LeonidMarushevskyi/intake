import NarrativeForm from 'screenings/narrative/NarrativeForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeForm', () => {
  function renderNarrative({actions = {}, ...args}) {
    const props = {actions, ...args}
    return shallow(<NarrativeForm {...props} />)
  }

  it('displays the narrative text field', () => {
    const component = renderNarrative({reportNarrative: 'This is my favorite screening'})
    const narrativeField = component.find('FormField').childAt(0)
    expect(narrativeField.props().value).toEqual('This is my favorite screening')
  })

  it('displays errors', () => {
    const component = renderNarrative({errors: ['missing a thing']})
    const narrativeField = component.find('FormField')
    expect(narrativeField.props().errors).toEqual(['missing a thing'])
  })

  it('calls setField when the narrative changes', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderNarrative({actions: {setField}})
    component.find('textarea').simulate('change', {target: {value: 'New narrative'}})
    expect(setField).toHaveBeenCalledWith('report_narrative', 'New narrative')
  })

  it('blurring narrative calls touchField with the proper parameter', () => {
    const touchField = jasmine.createSpy('touchField')
    const component = renderNarrative({actions: {touchField}})
    component.find('textarea').simulate('blur')
    expect(touchField).toHaveBeenCalledWith('report_narrative')
  })

  it('canceling edit calls the onChange param, resetFields, and touchAllFields', () => {
    const resetFieldValues = jasmine.createSpy('resetFieldValues')
    const toggleShow = jasmine.createSpy('toggleShow')
    const touchAllFields = jasmine.createSpy('touchAllFields')
    const screening = {report_narrative: 'ABC'}
    const component = renderNarrative({actions: {resetFieldValues, touchAllFields}, toggleShow, screening})
    component.find('.btn.btn-default').simulate('click')
    expect(resetFieldValues).toHaveBeenCalledWith(screening)
    expect(toggleShow).toHaveBeenCalled()
    expect(touchAllFields).toHaveBeenCalled()
  })

  it('saving changes calls saveScreening with the screening with Edits, touches all fields, and toggles the form', () => {
    const screeningWithEdits = {report_narrative: 'ABC'}
    const saveScreening = jasmine.createSpy('saveScreening')
    const touchAllFields = jasmine.createSpy('touchAllFields')
    const toggleShow = jasmine.createSpy('toggleShow')
    const component = renderNarrative({actions: {saveScreening, touchAllFields}, toggleShow, screeningWithEdits})
    component.find('.btn.btn-primary').simulate('click')
    expect(saveScreening).toHaveBeenCalledWith(screeningWithEdits)
    expect(touchAllFields).toHaveBeenCalled()
    expect(toggleShow).toHaveBeenCalled()
  })
})

