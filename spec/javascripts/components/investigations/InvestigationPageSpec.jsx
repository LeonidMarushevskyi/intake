import InvestigationPage from 'investigations/InvestigationPage'
import React from 'react'
import {shallow} from 'enzyme'

describe('InvestigationPage', () => {
  it('renders screening summary card', () => {
    const component = shallow(<InvestigationPage />)
    expect(component.find('.card-header').text()).toContain('Screening Summary')
  })
})
