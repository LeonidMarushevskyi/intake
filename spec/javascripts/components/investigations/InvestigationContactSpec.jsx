import InvestigationContact from 'investigations/InvestigationContact'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('InvestigationContact', () => {
  function renderContact({
    investigationId = 'ABC123',
    actions = {},
    contact = {},
  }) {
    const props = {investigationId, actions, contact}
    return shallow(<InvestigationContact {...props} />)
  }

  it('displays the investigation Id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('.card-header')
    expect(header.text()).toEqual('New Contact - Investigation ABCD1234')
  })

  it('displays the started at datetime picker', () => {
    const component = renderContact({contact: {started_at: '2016-08-11T18:24:22.157Z'}})
    const startedAt = component.find('DateField')
    expect(startedAt.props().value).toEqual('2016-08-11T18:24:22.157Z')
  })

  it('changing started at fires setContact', () => {
    const setContact = jasmine.createSpy('setContact')
    const component = renderContact({actions: {setContact}, contact: {started_at: ''}})
    component.find('DateField').simulate('change', '123')
    expect(setContact).toHaveBeenCalledWith({started_at: '123'})
  })

  it('calls setContact when the component mounts', () => {
    const setContact = jasmine.createSpy('setContact')
    mount(
      <InvestigationContact
        investigationId='ABC123'
        actions={{setContact}}
        contact={{}}
      />
    )
    expect(setContact).toHaveBeenCalledWith({investigation_id: 'ABC123'})
  })
})
