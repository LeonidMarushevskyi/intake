import NarrativeEditView from 'components/screenings/NarrativeEditView'
import Immutable from 'immutable'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeEditView', () => {
  let component
  let onBlur
  let onCancel
  let onChange
  let onSave
  let screening

  describe('with VALID data', () => {
    beforeEach(() => {
      screening = Immutable.fromJS({
        report_narrative: 'some narrative',
      })
      onBlur = jasmine.createSpy('onBlur')
      onCancel = jasmine.createSpy('onCancel')
      onSave = jasmine.createSpy('onSave')
      onChange = jasmine.createSpy('onChange')
      component = mount(
        <NarrativeEditView
          errors={Immutable.Map()}
          onBlur={onBlur}
          onCancel={onCancel}
          onChange={onChange}
          onSave={onSave}
          screening={screening}
        />
      )
    })

    it('renders the narrative card header', () => {
      expect(component.find('#narrative-card .card-header').text()).toEqual('Narrative')
    })

    it('renders the report narrative label as required', () => {
      expect(component.find('textarea').props().required)
        .toEqual(true)
    })

    it('renders the report narrative textarea', () => {
      expect(component.find('textarea').props().value).toEqual('some narrative')
    })

    it('renders the save button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
    })

    it('calls onBlur when the form is submitted', () => {
      const textarea = component.find('textarea')
      textarea.simulate('blur')
      expect(onBlur).toHaveBeenCalled()
    })

    it('calls onSave when the form is submitted', () => {
      const saveButton = component.find('button[children="Save"]')
      saveButton.simulate('click')
      expect(onSave).toHaveBeenCalled()
    })

    it('calls onChange when the report narrative is changed', () => {
      const narrative = component.find('#report_narrative')
      narrative.simulate('change', {target: {value: 'My new narrative'}})
      expect(onChange).toHaveBeenCalledWith(['report_narrative'], 'My new narrative')
    })

    it('renders the cancel link', () => {
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })

    it('clicking cancel fires onCancel', () => {
      const cancelButton = component.find('.btn.btn-default')
      cancelButton.simulate('click')
      expect(onCancel).toHaveBeenCalled()
    })
  })

  describe('with INVALID data', () => {
    let errors
    beforeEach(() => {
      errors = Immutable.fromJS({report_narrative: ['That is not a report narrative, this is a report narrative']})
      screening = Immutable.fromJS({
        report_narrative: '',
      })
      onBlur = jasmine.createSpy('onBlur')
      onCancel = jasmine.createSpy('onCancel')
      onSave = jasmine.createSpy('onSave')
      onChange = jasmine.createSpy('onChange')
      component = mount(
        <NarrativeEditView
          errors={errors}
          onBlur={onBlur}
          onCancel={onCancel}
          onChange={onChange}
          onSave={onSave}
          screening={screening}
        />
      )
    })

    it('renders the narrative error', () => {
      expect(component.find('FormField').html()).toContain(errors.get('report_narrative').first())
    })
  })
})
