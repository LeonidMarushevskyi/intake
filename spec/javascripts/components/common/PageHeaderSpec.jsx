import {PageHeader} from 'common/PageHeader'
import React from 'react'
import {shallow} from 'enzyme'

describe('PageHeader', () => {
  function renderHeader({...props}) {
    return shallow(
      <PageHeader {...props}>
        <span id='child'/>
      </PageHeader>,
      {disableLifecycleMethods: true}
    )
  }

  it('renders the page header title', () => {
    const pageHeader = renderHeader({pageTitle: 'Dashboard', hasError: false})
    expect(pageHeader.find('PageHeader').props().pageTitle).toEqual('Dashboard')
  })

  it('renders the page header button', () => {
    const button = <button>Start Screening</button>
    const pageHeader = renderHeader({button})
    expect(pageHeader.find('PageHeader').props().button).toEqual(button)
  })

  describe('error banner', () => {
    it('is not rendered when no errors', () => {
      const component = renderHeader({hasError: false})
      expect(component.find('PageError').exists()).toEqual(false)
    })

    it('is rendered when generic error occurs', () => {
      const component = renderHeader({hasError: true})
      expect(component.find('PageError').exists()).toEqual(true)
    })

    it('is rendered when pageErrorMessage exists', () => {
      const component = renderHeader({hasError: true, pageErrorMessage: 'pageErrorMessage'})
      expect(component.find('PageError').exists()).toEqual(true)
    })
  })
})
