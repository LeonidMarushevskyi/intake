import Contact from 'investigations/Contact'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('Contact', () => {
  function renderContact({
    investigationId = 'ABC123',
    actions = {},
    contact = {},
    errors = {},
    statuses = [],
  }) {
    const props = {investigationId, actions, contact, statuses, errors}
    return shallow(<Contact {...props} />)
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
    expect(startedAt.props().value).toEqual('2016-08-11T18:24:22.157Z')
  })

  it('changing started at fires setContactField', () => {
    const setContactField = jasmine.createSpy('setContactField')
    const component = renderContact({actions: {setContactField}, contact: {started_at: ''}})
    component.find('DateField').simulate('change', '123')
    expect(setContactField).toHaveBeenCalledWith('started_at', '123')
  })

  it('blurring started at fires touchContactField', () => {
    const touchContactField = jasmine.createSpy('touchContactField')
    const component = renderContact({actions: {touchContactField}, contact: {started_at: ''}})
    component.find('DateField').simulate('blur')
    expect(touchContactField).toHaveBeenCalledWith('started_at')
  })

  it('displays the status dropdown', () => {
    const component = renderContact({
      contact: {status: 'S'},
      statuses: [
        {code: 'S', value: 'Scheduled'},
        {code: 'A', value: 'Attempted'},
        {code: 'C', value: 'Completed'},
      ],
      errors: {status: ['This could be wrong!']},
    })
    const statusField = component.find('SelectField')
    expect(statusField.props().value).toEqual('S')
    expect(statusField.childAt(0).props().value).toEqual('')
    expect(statusField.childAt(1).props().value).toEqual('S')
    expect(statusField.childAt(2).props().value).toEqual('A')
    expect(statusField.childAt(3).props().value).toEqual('C')
    expect(statusField.props().errors).toEqual(['This could be wrong!'])
  })

  it('changing status fires setContactField', () => {
    const setContactField = jasmine.createSpy('setContactField')
    const component = renderContact({actions: {setContactField}, contact: {status: ''}})
    component.find('SelectField').simulate('change', {target: {value: 'C'}})
    expect(setContactField).toHaveBeenCalledWith('status', 'C')
  })

  it('blurring status at fires touchContactField', () => {
    const touchContactField = jasmine.createSpy('touchContactField')
    const component = renderContact({actions: {touchContactField}, contact: {status: ''}})
    component.find('SelectField').simulate('blur')
    expect(touchContactField).toHaveBeenCalledWith('status')
  })

  it('displays note', () => {
    const component = renderContact({contact: {note: 'This is a simple contact note'}})
    const noteField = component.find('textarea')
    expect(noteField.text()).toContain('This is a simple contact note')
  })

  it('changing note fires setContactField', () => {
    const setContactField = jasmine.createSpy('setContactField')
    const component = renderContact({
      actions: {setContactField}, contact: {note: 'This is a simple contact note'},
    })
    component.find('textarea').simulate('change', {target: {value: 'This is a new note'}})
    expect(setContactField).toHaveBeenCalledWith('note', 'This is a new note')
  })

  it('calls build when the component mounts', () => {
    const build = jasmine.createSpy('build')
    mount(
      <Contact
        investigationId='ABC123'
        actions={{build}}
        contact={{}}
        statuses={[]}
      />
    )
    expect(build).toHaveBeenCalledWith({investigation_id: 'ABC123'})
  })
})
