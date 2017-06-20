import React from 'react'
import Immutable from 'immutable'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import {mount} from 'enzyme'

describe('ScreeningInformationCardView', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      onCancel: jasmine.createSpy('onCancel'),
      onChange: jasmine.createSpy('onChange'),
      onSave: jasmine.createSpy().and.returnValue(Promise.resolve()),
      screening: Immutable.fromJS({
        name: 'Johnson',
        assignee: 'Michael Bluth',
        started_at: '2016-08-13T10:00:00.000Z',
        ended_at: '2016-08-22T11:00:00.000Z',
        communication_method: 'mail',
      }),
    }
  })

  describe('onBlur', () => {
    beforeEach(() => {
      component = mount(<ScreeningInformationCardView {...props} mode='edit' />)
    })

    it('adds errors after focus is lost', () => {
      const assigneeInput = component.find('#assignee')
      assigneeInput.simulate('focus')
      assigneeInput.simulate('blur')
      expect(component.update().text()).toContain('Error 1')
    })
  })

  describe('in edit mode', () => {
    beforeEach(() => {
      component = mount(<ScreeningInformationCardView {...props} mode='edit' />)
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
      beforeEach(() => {
        component.find('.btn.btn-primary').simulate('click')
      })

      it('saves the correct fields', () => {
        expect(props.onSave).toHaveBeenCalledWith(Immutable.fromJS([
          'assignee',
          'communication_method',
          'ended_at',
          'name',
          'started_at',
        ]))
      })
    })

    describe('cancel button', () => {
      beforeEach(() => {
        component.find('#name').simulate(
          'change', {target: {value: 'Cancel this change!'}}
        )
        component.find('.btn.btn-default').simulate('click')
      })

      it('cancels the correct fields', () => {
        expect(props.onCancel).toHaveBeenCalledWith(Immutable.fromJS([
          'assignee',
          'communication_method',
          'ended_at',
          'name',
          'started_at',
        ]))
      })

      it('discards changes on cancel', () => {
        component.setState({mode: 'edit'})
        expect(component.find('ScreeningInformationEditView').props().screening.name)
          .not.toEqual('Cancel this change!')
      })
    })
  })

  describe('in show mode', () => {
    beforeEach(() => {
      component = mount(<ScreeningInformationCardView {...props} mode='show' />)
    })
    it('renders the show card', () => {
      expect(component.find('ScreeningInformationShowView').length).toEqual(1)
    })
    it('displays edit card when edit link is clicked', () => {
      component.find('a[aria-label="Edit screening information"]').simulate('click')
      expect(component.find('ScreeningInformationEditView').length).toEqual(1)
    })
  })
})

