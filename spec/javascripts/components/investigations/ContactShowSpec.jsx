import ContactShow from 'investigations/ContactShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('ContactShow', () => {
  function renderContact({id = '123', investigationId = '456', people = [], ...otherProps}) {
    const props = {id, investigationId, people, ...otherProps}
    return shallow(<ContactShow {...props} />, {disableLifecycleMethods: true})
  }
  function renderContactWithLifecycle({people = [], ...otherProps}) {
    const props = {people, ...otherProps}
    return shallow(<ContactShow {...props} />)
  }

  it('passes the page title to the header', () => {
    const pageTitle = 'Contact - Investigation 1234'
    const component = renderContact({pageTitle})
    expect(component.find('Connect(PageHeader)').exists()).toBe(true)
    expect(component.find('Connect(PageHeader)').props().pageTitle).toEqual(pageTitle)
  })

  it('passes a null button to the page header so it does not render the default button', () => {
    const button = null
    const component = renderContact({button})
    expect(component.find('Connect(PageHeader)').exists()).toBe(true)
    expect(component.find('Connect(PageHeader)').props().button).toEqual(button)
  })

  it('displays the investigation Id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('.card-header')
    expect(header.text()).toContain('Contact - Investigation ABCD1234')
  })

  it('displays the Date & Time', () => {
    const component = renderContact({startedAt: '2016-08-11T18:24:22.157Z'})
    expect(component.find('.card').html()).toContain('(08/11/2016 11:24 AM)')
  })

  it('displays the status', () => {
    const component = renderContact({status: 'Completed'})
    expect(component.find('.card').html()).toContain('Completed')
  })

  it('displays the purpose', () => {
    const component = renderContact({purpose: 'Investigate Referral'})
    expect(component.find('.card').html()).toContain('Investigate Referral')
  })

  it('displays the communication method', () => {
    const component = renderContact({communicationMethod: 'In person'})
    expect(component.find('.card').html()).toContain('In person')
  })

  it('displays the location', () => {
    const component = renderContact({location: 'School'})
    expect(component.find('.card').html()).toContain('School')
  })

  it('displays the people present on the contact', () => {
    const component = renderContact({people: ['Robert Smith', 'Stephanie Catherine Johns']})
    expect(component.find('.card').html()).toContain('Robert Smith')
    expect(component.find('.card').html()).toContain('Stephanie Catherine Johns')
  })

  it('fetches the contact when the component mounts', () => {
    const fetch = jasmine.createSpy('fetch')
    const investigationId = 'INVESTIGATION_ID'
    const id = 'CONTACT_ID'
    renderContactWithLifecycle({investigationId, id, actions: {fetch}})
    expect(fetch).toHaveBeenCalledWith(investigationId, id)
  })

  it('displays an edit link', () => {
    const editLink = renderContact({}).find('EditLink')
    expect(editLink.exists()).toEqual(true)
    expect(editLink.props().ariaLabel).toEqual('Edit contact')
  })

  it('clicking edit calls onEdit', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const editLink = renderContact({onEdit}).find('EditLink')
    const event = jasmine.createSpyObj('event', ['preventDefault'])
    editLink.simulate('click', event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(onEdit).toHaveBeenCalled()
  })
})
