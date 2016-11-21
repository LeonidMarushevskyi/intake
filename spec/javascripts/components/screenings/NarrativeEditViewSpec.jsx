import NarrativeEditView from 'components/screenings/NarrativeEditView'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeEditView', () => {
  let wrapper
  let onCancel
  let onChange
  let onSave

  beforeEach(() => {
    onCancel = jasmine.createSpy('onCancel')
    onSave = jasmine.createSpy('onSave')
    onChange = jasmine.createSpy('onChange')
    wrapper = mount(
      <NarrativeEditView
        onCancel={onCancel}
        onChange={onChange}
        onSave={onSave}
        narrative={'some narrative'}
      />
    )
  })

  it('renders the narrative card header', () => {
    expect(wrapper.find('#narrative-card .card-header').text()).toEqual('Narrative')
  })

  it('renders the report narrative textarea', () => {
    expect(wrapper.find('textarea').props().value).toEqual('some narrative')
  })

  it('renders the save button', () => {
    expect(wrapper.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('calls onSave when the form is submitted', () => {
    const form = wrapper.find('form')
    form.simulate('submit')
    expect(onSave).toHaveBeenCalled()
  })

  it('calls onChange when the report narrative is changed', () => {
    const narrative = wrapper.find('#report_narrative')
    narrative.simulate('change', {target: {value: 'My new narrative'}})
    expect(onChange).toHaveBeenCalledWith('My new narrative')
  })

  it('renders the cancel link', () => {
    expect(wrapper.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('clicking cancel fires onCancel', () => {
    const cancelButton = wrapper.find('.btn.btn-default')
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })
})
