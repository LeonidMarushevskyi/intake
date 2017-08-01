import WorkerSafetyShowView from 'screenings/WorkerSafetyShowView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy('onEdit')
    component = shallow(
      <WorkerSafetyShowView
        safetyAlerts={Immutable.fromJS(['Gang Affiliation or Gang Activity'])}
        safetyInformation={'Be careful!'}
        onEdit={onEdit}
      />
    )
  })
  it('renders worker card header', () => {
    expect(component.find('.card-header').text()).toContain('Worker Safety')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit worker safety')
  })

  it('renders the worker safety show fields', () => {
    const alerts = component.find('ShowField[label="Worker safety alerts"]')
    expect(component.find('ShowField[label="Additional safety information"]').html())
      .toContain('Be careful!')
    expect(alerts.find('li').html())
      .toContain('Gang Affiliation or Gang Activity')
  })

  describe('clicking the edit link', () => {
    beforeEach(() => {
      component.find('EditLink').simulate('click')
    })
    it('switches to edit mode when edit icon is clicked', () => {
      expect(onEdit).toHaveBeenCalled()
    })
  })
})
