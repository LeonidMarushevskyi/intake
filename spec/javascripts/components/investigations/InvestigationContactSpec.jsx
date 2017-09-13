import InvestigationContact from 'investigations/InvestigationContact'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('InvestigationContact', () => {
  function renderContact({
    investigationId = 'ABC123',
    actions = {},
    contact = {},
    errors = {},
    statuses = [],
  }) {
    const props = {investigationId, actions, contact, statuses, errors}
    return shallow(<InvestigationContact {...props} />)
  }

  it('displays the investigation Id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('.card-header')
    expect(header.text()).toEqual('New Contact - Investigation ABCD1234')
  })

  it('displays the started at datetime picker', () => {
    const component = renderContact({
      contact: {started_at: '2016-08-11T18:24:22.157Z'},
      errors: {started_at: ['Things are wrong!']},
    })
    const startedAt = component.find('DateField')
    expect(startedAt.props().errors).toEqual(['Things are wrong!'])
  })

  it('changing started at fires setContact', () => {
    const setContact = jasmine.createSpy('setContact')
    const component = renderContact({actions: {setContact}, contact: {started_at: ''}})
    component.find('DateField').simulate('change', '123')
    expect(setContact).toHaveBeenCalledWith({started_at: '123'})
  })

  it('displays the status dropdown', () => {
    const component = renderContact({
      contact: {status: 'S'},
      statuses: [
        {code: 'S', value: 'Scheduled'},
        {code: 'A', value: 'Attempted'},
        {code: 'C', value: 'Completed'},
      ],
    })
    const statusField = component.find('SelectField')
    expect(statusField.props().value).toEqual('S')
    expect(statusField.childAt(0).props().value).toEqual('')
    expect(statusField.childAt(1).props().value).toEqual('S')
    expect(statusField.childAt(2).props().value).toEqual('A')
    expect(statusField.childAt(3).props().value).toEqual('C')
  })

  it('changing status fires setContact', () => {
    const setContact = jasmine.createSpy('setContact')
    const component = renderContact({actions: {setContact}, contact: {status: ''}})
    component.find('SelectField').simulate('change', {target: {value: 'C'}})
    expect(setContact).toHaveBeenCalledWith({status: 'C'})
  })

  it('calls setContact when the component mounts', () => {
    const setContact = jasmine.createSpy('setContact')
    mount(
      <InvestigationContact
        investigationId='ABC123'
        actions={{setContact}}
        contact={{}}
        statuses={[]}
      />
    )
    expect(setContact).toHaveBeenCalledWith({investigation_id: 'ABC123'})
  })
})
