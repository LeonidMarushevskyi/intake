import ReferralView from 'history/ReferralView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ReferralView', () => {
  const renderReferralView = ({...props}) => (
    shallow(<ReferralView {...props}/>)
  )

  it('renders a single date for the history entry in the first column', () => {
    const startDate = '2008-01-02'
    const component = renderReferralView({startDate})
    expect(component.find('td').at(0).text()).toEqual('01/02/2008')
  })

  it('renders a date range for the history entry in the first column', () => {
    const startDate = '2008-01-02'
    const endDate = '2009-01-02'
    const component = renderReferralView({startDate, endDate})
    expect(component.find('td').at(0).text()).toEqual('01/02/2008 - 01/02/2009')
  })

  it('renders a history entry of type Referral with its id, status, and access notification in the second column', () => {
    const referralId = 1
    const status = 'open'
    const component = renderReferralView({referralId, status})
    expect(component.find('td').at(1).find('.referral').text()).toEqual('Referral')
    expect(component.find('td').at(1).find('.referral-id').text()).toEqual('1')
    expect(component.find('td').at(1).find('.referral-status').text()).toEqual(`(${status})`)
  })

  it('renders an access notification in the second column only if its present', () => {
    const notification = 'notification'
    const componentWithNotification = renderReferralView({notification})
    expect(componentWithNotification.find('td').at(1).find('.information-flag').text()).toEqual(notification)
    const componentWithoutNotification = renderReferralView()
    expect(componentWithoutNotification.find('td').at(1).text()).not.toContain(notification)
  })

  it('renders a history entry with its incident county in the third column', () => {
    const county = 'Yolo'
    const component = renderReferralView({county})
    expect(component.find('td').at(2).text()).toEqual(county)
  })

  it('renders a table for people and roles in the fourth column', () => {
    const component = renderReferralView()
    expect(component.find('td').at(3).find('table').isEmpty()).toBeFalsy()
  })

  describe('for people and roles', () => {
    it('renders a header for victims, perpetrators, and allegations/disposition', () => {
      const component = renderReferralView()
      expect(component.find('.people-and-roles').find('th.victim').text()).toEqual('Victim')
      expect(component.find('.people-and-roles').find('th.perpetrator').text()).toEqual('Perpetrator')
      expect(component.find('.people-and-roles').find('th.allegations.disposition').text()).toEqual('Allegation(s) & Disposition')
    })

    it('renders a victim for each person', () => {
      const peopleAndRoles = [
        {victim: 'Jane Doe'},
        {victim: 'Homer Simpson'},
      ]
      const component = renderReferralView({peopleAndRoles})
      expect(component.find('.people-and-roles').find('tbody tr').at(0).find('td.victim').text()).toEqual('Jane Doe')
      expect(component.find('.people-and-roles').find('tbody tr').at(1).find('td.victim').text()).toEqual('Homer Simpson')
    })

    it('renders a perpetrator for each person', () => {
      const peopleAndRoles = [
        {perpetrator: 'Jane Doe'},
        {perpetrator: 'Homer Simpson'},
      ]
      const component = renderReferralView({peopleAndRoles})
      expect(component.find('.people-and-roles').find('tbody tr').at(0).find('td.perpetrator').text()).toEqual('Jane Doe')
      expect(component.find('.people-and-roles').find('tbody tr').at(1).find('td.perpetrator').text()).toEqual('Homer Simpson')
    })

    it('renders a allegations and disposition for each person', () => {
      const peopleAndRoles = [
        {allegations: 'allegations one', disposition: 'pending'},
        {allegations: 'allegations two', disposition: 'not pending'},
      ]
      const component = renderReferralView({peopleAndRoles})
      expect(component.find('.people-and-roles').find('tbody tr').at(0).find('td.allegations.disposition').text()).toEqual('allegations one (pending)')
      expect(component.find('.people-and-roles').find('tbody tr').at(1).find('td.allegations.disposition').text()).toEqual('allegations two (not pending)')
    })
  })
})
