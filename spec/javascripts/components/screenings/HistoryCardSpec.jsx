import React from 'react'
import HistoryCard from 'components/screenings/HistoryCard'
import {shallow} from 'enzyme'

describe('HistoryCard', () => {
  it('renders history card headings', () => {
    const component = shallow(<HistoryCard />)
    const tr = component.find('tr')
    expect(tr.text()).toContain('Date')
    expect(tr.text()).toContain('Type/Status')
    expect(tr.text()).toContain('County/Office')
    expect(tr.text()).toContain('People and Roles')
  })
})
