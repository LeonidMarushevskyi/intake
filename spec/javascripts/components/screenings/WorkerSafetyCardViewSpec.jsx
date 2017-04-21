import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('WorkerSafetyCardView', () => {
  let component
  const props = {
    onEdit: jasmine.createSpy(),
  }

  beforeEach(() => {
    component = shallow(<WorkerSafetyCardView mode='show'/>)
  })

  describe('when mode is set to show', () => {
    beforeEach(() => {
      component = mount(<WorkerSafetyCardView {...props} mode='show'/>)
    })
    it('renders the worker safety show card', () => {
      expect(component.find('WorkerSafetyShowView').length).toEqual(1)
    })
  })
})
