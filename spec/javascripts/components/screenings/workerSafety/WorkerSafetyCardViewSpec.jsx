import Immutable from 'immutable'
import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('WorkerSafetyCardView', () => {
  let component
  const props = {
    screening: Immutable.fromJS({
      safety_alerts: ['Gang Affiliation or Gang Activity'],
      safety_information: 'Info',
    }),
  }

  beforeEach(() => {
    const promiseSpy = jasmine.createSpyObj('promiseSpyObj', ['then'])
    props.onCancel = jasmine.createSpy('onCancel')
    props.onChange = jasmine.createSpy('onChange')
    props.onEdit = jasmine.createSpy('onEdit')
    props.onSave = jasmine.createSpy('onSave').and.returnValue(promiseSpy)
  })

  describe('when mode is set to show', () => {
    beforeEach(() => {
      component = mount(<WorkerSafetyCardView {...props} mode='show'/>)
    })
    it('renders the worker safety show card', () => {
      expect(component.find('WorkerSafetyShowView').length).toEqual(1)
    })
    it('changes the mode when onEdit is called', () => {
      component.find('a[aria-label="Edit worker safety"]').simulate('click')
      expect(component.instance().state.mode).toEqual('edit')
    })
  })

  describe('when mode is set to edit', () => {
    beforeEach(() => {
      component = shallow(<WorkerSafetyCardView {...props} mode='edit'/>)
    })
    it('renders the worker safety edit card', () => {
      expect(component.find('WorkerSafetyShowView').length).toEqual(0)
      expect(component.find('WorkerSafetyEditView').length).toEqual(1)
    })
    it('is passed to onCancel', () => {
      component.instance().onCancel()
      expect(props.onCancel).toHaveBeenCalledWith(Immutable.List(['safety_alerts', 'safety_information']))
    })
    it('is passed to onSave', () => {
      component.instance().onSave()
      expect(props.onSave).toHaveBeenCalledWith(Immutable.List(['safety_alerts', 'safety_information']))
    })
  })
})
