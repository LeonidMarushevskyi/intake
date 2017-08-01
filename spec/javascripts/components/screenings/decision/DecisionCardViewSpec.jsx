import * as IntakeConfig from 'config'
import React from 'react'
import Immutable from 'immutable'
import DecisionCardView from 'components/screenings/DecisionCardView'
import {mount, shallow} from 'enzyme'

describe('DecisionCardView', () => {
  let component
  let props
  beforeEach(() => {
    const sdmPath = 'https://ca.sdmdata.org'
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
    props = {
      onCancel: jasmine.createSpy('onCancel'),
      onChange: jasmine.createSpy('onChange'),
      onSave: jasmine.createSpy().and.returnValue(Promise.resolve()),
      screening: Immutable.fromJS({
        screening_decision_detail: 'The service',
        screening_decision: 'differential_response',
        additional_information: 'the decision is taken',
      }),
      areValidAllegationsPresent: true,
    }
  })
  describe('in edit mode', () => {
    beforeEach(() => {
      component = mount(<DecisionCardView {...props} mode='edit' />)
    })

    it('blanks decision details when decision type is changed', () => {
      component.find('#decisionDetail').simulate(
          'change', {target: {value: 'The service in question'}}
      )
      expect(props.onChange).toHaveBeenCalledWith(['screening_decision_detail'], 'The service in question')
      component.find('#screening_decision').simulate(
          'change', {target: {value: 'screen_out'}}
      )
      expect(props.onChange.calls.argsFor(1)).toContain(['screening_decision'], 'screen_out')

      // We need to call the callback passed to the spy in order to trigger the second call
      // to onChange
      props.onChange.calls.mostRecent().args[2]()
      expect(props.onChange).toHaveBeenCalledWith(['screening_decision_detail'], '')
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
        expect(props.onSave).toHaveBeenCalledWith(Immutable.fromJS([
          'screening_decision_detail',
          'screening_decision',
          'additional_information',
        ]))
      })
    })
    describe('cancel button', () => {
      beforeEach(() => {
        component.find('#additional_information').simulate(
          'change', {target: {value: 'the decision is changed'}}
        )
        component.find('.btn.btn-default').simulate('click')
      })
      it('cancels the correct fields', () => {
        expect(props.onCancel).toHaveBeenCalledWith(Immutable.fromJS([
          'screening_decision_detail',
          'screening_decision',
          'additional_information',
        ]))
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

    it('passes errors from the state', () => {
      expect(component.find('DecisionShowView').props().errors.toJS())
        .toEqual({screening_decision: []})
    })
  })

  describe('validateField', () => {
    beforeEach(() => {
      props.screening = props.screening.set('screening_decision', 'differential_response')
    })

    describe('when valid allegations are present', () => {
      it('does not add errors for screening decision when it is promote_to_referral', () => {
        const component = shallow(<DecisionCardView {...props} areValidAllegationsPresent={true} mode={'edit'}/>)
        component.instance().validateField('screening_decision', 'promote_to_referral')
        const errorProps = component.update().find('DecisionEditView').props().errors
        const expectedErrors = {screening_decision: []}
        expect(Immutable.is(errorProps, Immutable.fromJS(expectedErrors))).toEqual(true)
        expect(errorProps.toJS()).toEqual(expectedErrors)
      })
    })

    describe('when valid allegations are not present', () => {
      it('adds errors for screening decision when it is promote_to_referral', () => {
        const component = shallow(<DecisionCardView {...props} areValidAllegationsPresent={false} mode={'edit'}/>)
        component.instance().validateField('screening_decision', 'promote_to_referral')
        const errorProps = component.update().find('DecisionEditView').props().errors
        const expectedErrors = {screening_decision: ['Please enter at least one allegation to promote to referral.']}
        expect(Immutable.is(errorProps, Immutable.fromJS(expectedErrors))).toEqual(true)
        expect(errorProps.toJS()).toEqual(expectedErrors)
      })
    })
  })
})

