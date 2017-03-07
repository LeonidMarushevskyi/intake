import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyCardView', () => {
  it('renders blank worker safety card view', () => {
    const component = shallow(<WorkerSafetyCardView />)
    expect(component.find('.card-header').text()).toEqual('Worker Safety')
  })
})
