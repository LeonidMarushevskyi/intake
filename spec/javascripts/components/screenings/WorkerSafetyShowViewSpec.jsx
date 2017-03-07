import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyShowView', () => {
  it('renders blank worker safety show view', () => {
    const component = shallow(<WorkerSafetyShowView />)
    expect(component.find('.card-header').text()).toEqual('Worker Safety')
  })
})
