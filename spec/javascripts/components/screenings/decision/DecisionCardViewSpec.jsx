import * as IntakeConfig from 'common/config'
import React from 'react'
import Immutable from 'immutable'
import DecisionCardView from 'screenings/DecisionCardView'
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
      errors: Immutable.Map(),
      editable: true,
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
          'access_restrictions',
          'restrictions_rationale',
        ]))
      })
    })
  })

  it('renders the show card', () => {
    component = shallow(<DecisionCardView {...props} mode='show' />)
    expect(component.find('Connect(ScreeningDecisionShow)').length).toEqual(1)
  })

  describe('onBlur', () => {
    it('adds the proper field to the list of fields to display errors for', () => {
      const component = shallow(<DecisionCardView {...props} mode={'edit'}/>)
      component.instance().onBlur('screening_decision')
      expect(component.state().displayErrorsFor.toJS()).toEqual(['screening_decision'])
    })
  })

  describe('filteredErrors', () => {
    it('only returns errors for fields that are in the displayErrorFor list', () => {
      const errorProps = Immutable.fromJS({foo: ['foo error'], bar: ['bar error']})
      const component = shallow(<DecisionCardView {...props} mode={'edit'} errors={errorProps}/>)
      component.setState({displayErrorsFor: Immutable.List(['foo'])})
      const errors = component.instance().filteredErrors()
      expect(errors).toEqual({foo: ['foo error']})
    })
  })
})
