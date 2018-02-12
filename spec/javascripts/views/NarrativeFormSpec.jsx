import NarrativeForm from 'views/NarrativeForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeForm', () => {
  const renderNarrative = ({...props}) => (
    shallow(<NarrativeForm {...props} />, {disableLifecycleMethods: true})
  )

  it('displays the narrative text field', () => {
    const component = renderNarrative({reportNarrative: {value: 'This is my favorite screening'}})
    const narrativeField = component.find('FormField').childAt(0)
    expect(narrativeField.props().value).toEqual('This is my favorite screening')
  })

  it('displays errors', () => {
    const component = renderNarrative({reportNarrative: {errors: ['missing a thing']}})
    const narrativeField = component.find('FormField')
    expect(narrativeField.props().errors).toEqual(['missing a thing'])
  })

  it('calls onChange when the narrative changes', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderNarrative({onChange})
    component.find('textarea').simulate('change', {target: {value: 'New narrative'}})
    expect(onChange).toHaveBeenCalledWith('report_narrative', 'New narrative')
  })

  it('blurring narrative calls onBlur with the proper parameter', () => {
    const onBlur = jasmine.createSpy('onBlur')
    const component = renderNarrative({onBlur})
    component.find('textarea').simulate('blur')
    expect(onBlur).toHaveBeenCalledWith('report_narrative')
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderNarrative({onCancel})
    component.find('.btn.btn-default').simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderNarrative({onSave})
    component.find('.btn.btn-primary').simulate('click')
    expect(onSave).toHaveBeenCalled()
  })
})
