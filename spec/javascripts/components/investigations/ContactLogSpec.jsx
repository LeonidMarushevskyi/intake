import ContactLog from 'investigations/ContactLog'
import React from 'react'
import {shallow} from 'enzyme'

describe('ContactLog', () => {
  function renderContactLog({investigationId = 'ABC123', contactLogs = []}) {
    const props = {investigationId, contactLogs}
    return shallow(<ContactLog {...props} />)
  }

  it('displays the investigation investigationId in the header', () => {
    const component = renderContactLog({investigationId: 'ABCD1234'})
    const link = component.find('Link')
    expect(link.props().to).toEqual('/investigations/ABCD1234/contacts/new')
    expect(link.html()).toEqual('<a target="_blank">Create New Contact</a>')
  })

  it("displays the card heading 'Contact Log' with count", () => {
    const cardHeaderZero = renderContactLog({contactLogs: []}).find('.card-header')
    expect(cardHeaderZero.text()).toContain('Contact Log (0)')
    const cardHeaderOne = renderContactLog({
      contactLogs: [{}],
    }).find('.card-header')
    expect(cardHeaderOne.text()).toContain('Contact Log (1)')
    const cardHeaderMany = renderContactLog({
      contactLogs: [{}, {}, {}],
    }).find('.card-header')
    expect(cardHeaderMany.text()).toContain('Contact Log (3)')
  })

  it('displays table headings', () => {
    const tableHeadings = renderContactLog({}).find('thead')
    expect(tableHeadings.text()).toContain('Date/Time')
    expect(tableHeadings.text()).toContain('People present')
    expect(tableHeadings.text()).toContain('Method/Status')
    expect(tableHeadings.text()).toContain('Notes')
  })
})
