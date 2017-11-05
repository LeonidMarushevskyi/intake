import HistoryTable from 'views/history/HistoryTable'
import React from 'react'
import {shallow, mount} from 'enzyme'
import clipboard from 'clipboard-js'

describe('HistoryTable', () => {
  function renderHistoryTable({
    cases = [],
    referrals = [],
    screenings = [],
    showCopyButton = false,
  }) {
    const props = {cases, referrals, screenings, showCopyButton}
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

    describe('copy button', () => {
      const manualCopyMessage = 'To copy the history to your clipboard, highlight the table above, click the right button of your mouse, and select "Copy."'

      it('shows help text instead of copybutton if showCopyButton is set to false', () => {
        const component = renderHistoryTable({showCopyButton: false})
        expect(component.find('button[children="Copy"]').exists()).toEqual(false)
        expect(component.text()).toContain(manualCopyMessage)
      })

      it('displays a copy button with an onClick callback if showCopyButton is set to true', () => {
        const component = renderHistoryTable({showCopyButton: true})
        const copyButton = component.find('button[children="Copy"]')
        expect(copyButton.props().onClick).toEqual(jasmine.any(Function))
        expect(component.text()).not.toContain(manualCopyMessage)
      })

      it('calls the clipboard library when clicked', () => {
        spyOn(clipboard, 'copy')
        const component = mount(
          <HistoryTable
            cases={[]}
            referrals={[]}
            screenings={[]}
            showCopyButton={true}
          />
        )
        const resultsTable = component.find('table').node
        component.find('button[children="Copy"]').simulate('click')
        expect(clipboard.copy).toHaveBeenCalledWith({
          'text/plain': resultsTable.innerText,
          'text/html': resultsTable.outerHTML,
        })
      })
    })
  })
})
