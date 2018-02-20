import React from 'react'
import InvestigationPage from 'investigations/InvestigationPage'
import {shallow} from 'enzyme'

describe('InvestigationPage', () => {
  const renderInvestigationPage = ({...props}) => (
    shallow(<InvestigationPage {...props} />, {disableLifecycleMethods: true})
  )

  it('renders the screening summary container', () => {
    const investigationPage = renderInvestigationPage()
    expect(investigationPage.find('Connect(ScreeningSummary)').exists()).toBe(true)
  })

  it('renders the allegations card container', () => {
    const investigationPage = renderInvestigationPage()
    expect(investigationPage.find('Connect(CardView)').exists()).toBe(true)
    expect(investigationPage.find('Connect(CardView)').props().title).toBe('Allegations')
  })

  it('renders relationships', () => {
    const investigationPage = renderInvestigationPage()
    expect(investigationPage.find('Connect(RelationshipsCard)').exists()).toBe(true)
  })

  it('renders history of involvement', () => {
    const investigationPage = renderInvestigationPage()
    expect(investigationPage.find('Connect(HistoryOfInvolvement)').exists()).toBe(true)
  })

  it('renders the contact log', () => {
    const investigationPage = renderInvestigationPage()
    expect(investigationPage.find('Connect(ContactLog)').exists()).toBe(true)
  })

  it('passes the page title to the header', () => {
    const pageTitle = 'Investigation 1234'
    const investigationPage = renderInvestigationPage({pageTitle})
    expect(investigationPage.find('Connect(PageHeader)').exists()).toBe(true)
    expect(investigationPage.find('Connect(PageHeader)').props().pageTitle).toEqual(pageTitle)
  })

  it('passes a null button to the page header so it does not render the default button', () => {
    const button = null
    const investigationPage = renderInvestigationPage({button})
    expect(investigationPage.find('Connect(PageHeader)').exists()).toBe(true)
    expect(investigationPage.find('Connect(PageHeader)').props().button).toEqual(button)
  })
})
