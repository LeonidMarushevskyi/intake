import HistoryTable from 'history/HistoryTable'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryTable', () => {
  function renderHistoryTable({...props}) {
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

    it('renders a container for every screening', () => {
      const component = renderHistoryTable({screeningCount: 1})
      expect(component.find('Connect(ScreeningView)').length).toEqual(1)
    })

    it('renders a container for every referral', () => {
      const component = renderHistoryTable({referralCount: 2})
      expect(component.find('Connect(ReferralView)').length).toEqual(2)
    })

    it('renders a container for every case', () => {
      const component = renderHistoryTable({caseCount: 3})
      expect(component.find('Connect(CaseView)').length).toEqual(3)
    })
  })
})
