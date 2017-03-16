import CrossReportEditView from 'components/screenings/CrossReportEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportEditView', () => {
  it('renders blank cross report edit view', () => {
    const component = shallow(<CrossReportEditView />)
    expect(component.find('.card.edit .card-header').text()).toEqual('Cross Report')
  })
})
