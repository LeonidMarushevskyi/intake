import React from 'react'
import Immutable from 'immutable'
import DecisionCardView from 'components/screenings/DecisionCardView'
import {mount} from 'enzyme'

describe('DecisionCardView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onCancel: jasmine.createSpy('onCancel'),
      onChange: jasmine.createSpy('onChange'),
      onSave: jasmine.createSpy().and.returnValue(Promise.resolve()),
      screening: Immutable.fromJS({
        response_time: 'within_twenty_four_hours',
        screening_decision: 'accept_for_investigation',
        decision_rationale: 'the decision is taken',
      }),
    }
  })
  describe('in edit mode', () => {
    beforeEach(() => {
      component = mount(<DecisionCardView {...props} mode='edit' />)
    })
    it('renders the edit card', () => {
      expect(component.find('DecisionEditView').length).toEqual(1)
    })
    it('renders the save and cancel button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })
    describe('save button', () => {
      beforeEach(() => {
        component.find('.btn.btn-primary').simulate('click')
      })
      it('saves the correct fields', () => {
        expect(props.onSave).toHaveBeenCalledWith([
          'response_time',
          'screening_decision',
          'decision_rationale',
        ])
      })
    })
    describe('cancel button', () => {
      beforeEach(() => {
        component.find('#decision_rationale').simulate(
          'change', {target: {value: 'the decision is changed'}}
        )
        component.find('.btn.btn-default').simulate('click')
      })
      it('cancels the correct fields', () => {
        expect(props.onCancel).toHaveBeenCalledWith([
          'response_time',
          'screening_decision',
          'decision_rationale',
        ])
      })
      it('discards changes on cancel', () => {
        component.setState({mode: 'edit'})
        expect(component.find('DecisionEditView').props().screening.name)
          .not.toEqual('the decision is changed!')
      })
    })
  })

  describe('in show mode', () => {
    beforeEach(() => {
      component = mount(<DecisionCardView {...props} mode='show' />)
    })
    it('renders the show card', () => {
      expect(component.find('DecisionShowView').length).toEqual(1)
    })
    it('displays edit card when edit link is clicked', () => {
      component.find('a[aria-label="Edit decision card"]').simulate('click')
      expect(component.find('DecisionEditView').length).toEqual(1)
    })
  })
})

