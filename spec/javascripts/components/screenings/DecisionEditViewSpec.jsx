import Immutable from 'immutable'
import React from 'react'
import DecisionEditView from 'components/screenings/DecisionEditView'
import {shallow} from 'enzyme'

describe('DecisionEditView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onChange: jasmine.createSpy(),
      onCancel: jasmine.createSpy(),
      onSave: jasmine.createSpy(),
      screening: Immutable.fromJS({
        response_time: 'within_twenty_four_hours',
        screening_decision: 'accept_for_investigation',
      }),
    }
    component = shallow(<DecisionEditView {...props} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toEqual('Decision')
  })

  it('renders the input fields', () => {
    expect(component.find('SelectField[label="Response Time"]').props().value)
      .toEqual('within_twenty_four_hours')
    expect(component.find('SelectField[label="Screening Decision"]').props().value)
      .toEqual('accept_for_investigation')
  })

  it('renders the save button', () => {
    expect(component.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
  })

  it('fires the onChange call when a field changes', () => {
    component.find('#decision_rationale').simulate('change', {target: {value: 'the decision is taken'}})
    expect(props.onChange).toHaveBeenCalledWith(['decision_rationale'], 'the decision is taken')
  })

  it('calls onSave', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-primary').simulate('click')
    expect(props.onSave).toHaveBeenCalled()
  })

  it('calls onCancel', () => {
    component = shallow(<DecisionEditView {...props} />)
    component.find('.btn.btn-default').simulate('click')
    expect(props.onCancel).toHaveBeenCalled()
  })
})
