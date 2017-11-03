import HistoryTable from 'history/HistoryTable'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryTable', () => {
  function renderHistoryTable({
    cases = [],
    referrals = [],
    screenings = [],
  }) {
    const props = {cases, referrals, screenings}
    return shallow(<HistoryTable {...props}/>)
  }

  describe('HistoryTable', () => {
    it('displays column headings', () => {
      const component = renderHistoryTable({})
      const columnHeadings = component.find('table').find('thead').find('tr').find('th')
      expect(columnHeadings.at(0).text()).toEqual('Date')
      expect(columnHeadings.at(1).text()).toEqual('Type/Status')
      expect(columnHeadings.at(2).text()).toEqual('County/Office')
      expect(columnHeadings.at(3).text()).toEqual('People and Roles')
    })

    it('displays a table body', () => {
      const component = renderHistoryTable({})
      expect(component.find('tbody').exists()).toEqual(true)
    })

    it('renders a view for every screening', () => {
      const component = renderHistoryTable({screenings: [{}]})
      expect(component.find('ScreeningView').length).toEqual(1)
    })

    it('renders a view for every referral', () => {
      const component = renderHistoryTable({referrals: [{}, {}]})
      expect(component.find('ReferralView').length).toEqual(2)
    })

    it('renders a view for every case', () => {
      const component = renderHistoryTable({cases: [{}, {}, {}]})
      expect(component.find('CaseView').length).toEqual(3)
    })
  })
})
