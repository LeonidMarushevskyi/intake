import React from 'react'
import {shallow} from 'enzyme'
import CaseView from 'history/CaseView'

describe('History Case View', () => {
  const renderCaseView = ({...props}) => (
    shallow(<CaseView {...props} />)
  )

  it('Renders a date range in the first column', () => {
    const dateRange = '01/02/03 - 04/05/06'
    const component = renderCaseView({dateRange})
    expect(component.find('td').at(0).text()).toEqual(dateRange)
  })

  it('Renders the case id and status in the second column', () => {
    const status = 'Open'
    const caseId = 'ABC123'
    const component = renderCaseView({status, caseId})
    const idStatusCell = component.find('td').at(1)
    expect(idStatusCell.text()).toContain('Case')
    expect(idStatusCell.text()).toContain(`(${status})`)
    expect(idStatusCell.text()).toContain(caseId)
  })

  it('Renders the access notification in the second column', () => {
    const restrictedAccessStatus = 'Sealed'
    const component = renderCaseView({restrictedAccessStatus})
    expect(component.find('td').at(1).text()).toContain(restrictedAccessStatus)
    expect(component.find('.information-flag').exists()).toEqual(true)
  })

  it('Does not render access notification if none exists', () => {
    const restrictedAccessStatus = ''
    const component = renderCaseView({restrictedAccessStatus})
    expect(component.find('.information-flag').exists()).toEqual(false)
  })

  it('Renders the county in the third column', () => {
    const county = 'Plumas'
    const component = renderCaseView({county})
    expect(component.find('td').at(2).text()).toEqual(county)
  })

  it('Renders the focus child in the fourth column', () => {
    const focusChild = 'John Smith'
    const component = renderCaseView({focusChild})
    expect(component.find('td').at(3).text()).toContain(`Focus Child: ${focusChild}`)
  })

  it('Renders the parents in the fourth column', () => {
    const parents = 'John Smith, Jane Doe'
    const component = renderCaseView({parents})
    expect(component.find('td').at(3).text()).toContain(`Parent(s): ${parents}`)
  })

  it('Renders the name of the social worker', () => {
    const worker = 'Jane Doe'
    const component = renderCaseView({worker})
    expect(component.find('td').at(3).text()).toContain(`Worker: ${worker}`)
  })
})
