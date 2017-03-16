import CrossReportShowView from 'components/screenings/CrossReportShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportShowView', () => {
  it('renders blank cross report show view', () => {
    const component = shallow(<CrossReportShowView />)
    expect(component.find('.card.show .card-header').text()).toEqual('Cross Report')
  })
})
