import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyShowView', () => {
  let component
  beforeEach(() => {
    component = shallow(<WorkerSafetyShowView />)
  })
  it('renders worker safety show view', () => {
    expect(component.find('.card-header').text()).toContain('Worker Safety')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit worker safety')
  })

  it('renders the woker safety show fields', () => {
    expect(component.find('ShowField[label="Worker safety alerts"]').html())
      .toContain('')
  })
})
