import ScreeningView from 'history/ScreeningView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ScreeningView', () => {
  const renderScreeningView = ({...props}) => (
    shallow(<ScreeningView {...props} />)
  )

  it('renders a date range for the screening in the first column', () => {
    const dateRange = '01/02/2002 - 02/03/2002'
    const component = renderScreeningView({dateRange})
    expect(component.find('td').at(0).text()).toEqual('01/02/2002 - 02/03/2002')
  })

  it('renders a type/status for the screening in the second column', () => {
    const status = 'In Progress'
    const component = renderScreeningView({status})
    const divs = component.find('td').at(1).find('div')
    expect(divs.at(0).text()).toEqual('Screening')
    expect(divs.at(1).text()).toEqual(`(${status})`)
  })

  it('renders the appropriate county for the screening in the third column', () => {
    const county = 'Amador'
    const component = renderScreeningView({county})
    expect(component.find('td').at(2).text()).toEqual(county)
  })

  it('renders all people in the fourth column', () => {
    const people = 'John Smith, Jane Doe, Bob Jones'
    const component = renderScreeningView({people})
    expect(component.find('td').at(3).find('.people').text())
      .toEqual('John Smith, Jane Doe, Bob Jones')
  })

  it('renders the reporter in the the fourth column', () => {
    const reporter = 'Homer Simpson'
    const component = renderScreeningView({reporter})
    expect(component.find('td').at(3).find('.reporter').text()).toEqual('Reporter: Homer Simpson')
  })

  it('renders the social worker in the fourth column', () => {
    const worker = 'Sandy Simpson'
    const component = renderScreeningView({worker})
    expect(component.find('td').at(3).find('.worker').text()).toEqual('Worker: Sandy Simpson')
  })
})
