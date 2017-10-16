import ContactShow from 'investigations/ContactShow'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ContactShow', () => {
  function renderContact({id = '123', investigationId = '456', ...otherProps}) {
    const props = {id, investigationId, ...otherProps}
    return shallow(<ContactShow {...props} />)
  }
  function mountContact(props) {
    return mount(<ContactShow {...props} />)
  }

  it('displays the investigation Id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('.card-header')
    expect(header.text()).toEqual('Contact - Investigation ABCD1234')
  })

  it('displays the Date & Time', () => {
    const component = renderContact({startedAt: '2016-08-11T18:24:22.157Z'})
    expect(component.html()).toContain('(08/11/2016 11:24 AM)')
  })

  it('displays the status', () => {
    const component = renderContact({status: 'Completed'})
    expect(component.html()).toContain('Completed')
  })

  it('displays the purpose', () => {
    const component = renderContact({purpose: 'Investigate Referral'})
    expect(component.html()).toContain('Investigate Referral')
  })

  it('displays the communication method', () => {
    const component = renderContact({communicationMethod: 'In person'})
    expect(component.html()).toContain('In person')
  })

  it('displays the location', () => {
    const component = renderContact({location: 'School'})
    expect(component.html()).toContain('School')
  })

  it('displays the people present on the contact', () => {
    const component = renderContact({people: ['Robert Smith', 'Stephanie Catherine Johns']})
    expect(component.html()).toContain('Robert Smith')
    expect(component.html()).toContain('Stephanie Catherine Johns')
  })

  it('fetches the contact when the component mounts', () => {
    const fetch = jasmine.createSpy('fetch')
    const investigationId = 'INVESTIGATION_ID'
    const id = 'CONTACT_ID'
    mountContact({investigationId, id, actions: {fetch}})
    expect(fetch).toHaveBeenCalledWith(investigationId, id)
  })
})
