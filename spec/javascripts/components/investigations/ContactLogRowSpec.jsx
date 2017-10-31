import ContactLogRow from 'investigations/ContactLogRow'
import React from 'react'
import {shallow} from 'enzyme'

describe('ContactLogRow', () => {
  function renderContactLogRow({id, investigationId, startedAt, people = [], note, status, method}) {
    const props = {id, investigationId, startedAt, people, note, status, method}
    return shallow(<ContactLogRow {...props} />)
  }

  it('displays startedAt', () => {
    expect(renderContactLogRow({startedAt: 'some datetime'}).text()).toContain(
      'some datetime'
    )
  })

  it('displays people', () => {
    expect(renderContactLogRow({
      people: ['John', 'Bob', 'Carrol', 'Kerry'],
    }).text()).toContain('John, Bob, Carrol, Kerry')
  })

  it('displays method and status', () => {
    expect(renderContactLogRow({
      status: 'some status',
      method: 'some method',
    }).text()).toContain('some method(some status)')
  })

  it('displays note', () => {
    expect(
      renderContactLogRow({note: 'A sample note'}).text()
    ).toContain('A sample note')
  })

  it('displays a link to the contact', () => {
    const contactLink = renderContactLogRow({
      id: 'existing_contact_id',
      investigationId: 'existing_investigation_id',
    }).find('Link')
    expect(contactLink.exists()).toEqual(true)
    expect(contactLink.props().to).toEqual(
      '/investigations/existing_investigation_id/contacts/existing_contact_id'
    )
    expect(contactLink.html()).toContain('View contact')
  })
})
