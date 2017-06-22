import React from 'react'
import Immutable from 'immutable'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import {mount} from 'enzyme'
import * as Validator from 'utils/validator'

describe('ScreeningInformationCardView', () => {
  let component

  const baseProps = {
    onCancel: jasmine.createSpy('onCancel'),
    onChange: jasmine.createSpy('onChange'),
    onSave: jasmine.createSpy('onSave').and.returnValue(Promise.resolve()),
    screening: Immutable.fromJS({
      name: 'Johnson',
      assignee: 'Michael Bluth',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-22T11:00:00.000Z',
      communication_method: 'mail',
    }),
  }

  describe('onBlur', () => {
    beforeEach(() => {
      const props = {
        ...baseProps,
        screening: Immutable.fromJS({
          name: 'Johnson',
          assignee: '',
          started_at: '2016-08-13T10:00:00.000Z',
          ended_at: '2016-08-22T11:00:00.000Z',
          communication_method: 'mail',
        }),
      }
      component = mount(<ScreeningInformationCardView {...props} mode='edit' />)
    })

    it('adds errors after focus is lost', () => {
      const assigneeInput = component.find('#assignee')
      assigneeInput.simulate('focus')
      assigneeInput.simulate('blur')
      expect(component.update().text()) .toContain('Please enter an assigned worker.')
    })
  })

  describe('in edit mode', () => {
    beforeEach(() => {
      component = mount(<ScreeningInformationCardView {...baseProps} mode='edit' />)
    })

    it('renders the edit card', () => {
      expect(component.find('ScreeningInformationEditView').length).toEqual(1)
    })

    it('passes onBlur to the child component', () => {
      expect(component.find('ScreeningInformationEditView').props().onBlur).not.toEqual(undefined)
      expect(component.find('ScreeningInformationEditView').props().onBlur).toEqual(component.instance().onBlur)
    })

    it('passes errors from the state', () => {
      expect(component.find('ScreeningInformationEditView').props().errors).toEqual(Immutable.Map())
    })

    it('renders the save and cancel button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })

    describe('save button', () => {
      let validatorSpy

      beforeEach(() => {
        validatorSpy = spyOn(Validator, 'validateField').and.callThrough()
        component.find('.btn.btn-primary').simulate('click')
      })

      it('saves the correct fields', () => {
        expect(baseProps.onSave).toHaveBeenCalled()
        const args = baseProps.onSave.calls.mostRecent().args[0]
        const expectedArgs = [
          'assignee',
          'communication_method',
          'ended_at',
          'name',
          'started_at',
        ]
        expect(args.toJS()).toEqual(expectedArgs)
        expect(Immutable.is(args, Immutable.List(expectedArgs))).toEqual(true)
      })

      describe('async stuff', () => {
        beforeEach((done) => {
          // TODO Figure out a better place to call done for the save function
          setTimeout(done, 100)
        })

        it('validates values for the card', () => {
          expect(validatorSpy).toHaveBeenCalled()
        })
      })
    })

    describe('cancel button', () => {
      let validatorSpy

      beforeEach(() => {
        validatorSpy = spyOn(Validator, 'validateField').and.callThrough()
        component.find('#name').simulate(
          'change', {target: {value: 'Cancel this change!'}}
        )
        component.find('.btn.btn-default').simulate('click')
      })

      it('cancels the correct fields', () => {
        expect(baseProps.onCancel).toHaveBeenCalled()
        const args = baseProps.onCancel.calls.mostRecent().args[0]
        const expectedArgs = [
          'assignee',
          'communication_method',
          'ended_at',
          'name',
          'started_at',
        ]
        expect(args.toJS()).toEqual(expectedArgs)
        expect(Immutable.is(args, Immutable.List(expectedArgs))).toEqual(true)
      })

      it('discards changes on cancel', () => {
        component.setState({mode: 'edit'})
        expect(component.find('ScreeningInformationEditView').props().screening.name)
          .not.toEqual('Cancel this change!')
      })

      it('validates values for the card', () => {
        expect(validatorSpy).toHaveBeenCalled()
      })
    })
  })

  describe('in show mode', () => {
    describe('when assigned social worker is present', () => {
      beforeEach(() => {
        component = mount(<ScreeningInformationCardView {...baseProps} mode='show' />)
      })

      it('renders the show card', () => {
        expect(component.find('ScreeningInformationShowView').length).toEqual(1)
      })

      it('displays edit card when edit link is clicked', () => {
        component.find('a[aria-label="Edit screening information"]').simulate('click')
        expect(component.find('ScreeningInformationEditView').length).toEqual(1)
      })

      it('passes errors from the state', () => {
        expect(component.find('ScreeningInformationShowView').props().errors.toJS())
          .toEqual({
            assignee: [],
            communication_method: [],
            ended_at: [],
            name: [],
            started_at: [],
          })
      })
    })

    describe('when required fields are not populated', () => {
      let errors
      beforeEach(() => {
        const props = {
          ...baseProps,
          screening: Immutable.fromJS({
            name: 'Johnson',
            assignee: '',
            started_at: '2016-08-13T10:00:00.000Z',
            ended_at: '2016-08-22T11:00:00.000Z',
            communication_method: '',
          }),
        }
        component = mount(<ScreeningInformationCardView {...props} mode='show' />)
        errors = component.find('ScreeningInformationShowView').props().errors
      })

      it('validates the assigned social worker field', () => {
        expect(errors.get('assignee').toJS()).toContain('Please enter an assigned worker.')
      })

      it('validates the communication method field', () => {
        expect(errors.get('communication_method').toJS()).toContain('Please select a communication method.')
      })
    })
  })
})

