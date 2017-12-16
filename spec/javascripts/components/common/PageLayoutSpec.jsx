import {PageLayout} from 'common/PageLayout'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('PageLayout', () => {
  function renderLayout({actions = {}, hasError = null, errorCount = null}) {
    return shallow(
      <PageLayout actions={actions} hasError={hasError} errorCount={errorCount}>
        <span id='child'/>
      </PageLayout>
    )
  }

  it('fetches the system codes when the component mounts', () => {
    const fetchSystemCodesActionSpy = jasmine.createSpy('fetchSystemCodesAction')
    mount(
      <PageLayout actions={{fetchSystemCodesAction: fetchSystemCodesActionSpy}}><div/></PageLayout>
    )
    expect(fetchSystemCodesActionSpy).toHaveBeenCalled()
  })

  it('renders the page header component', () => {
    const app = renderLayout({hasError: false})
    expect(app.find('PageHeader').exists()).toEqual(true)
  })

  it('renders its children', () => {
    const app = renderLayout({actions: {}})
    expect(app.find('#child').exists()).toBe(true)
  })

  describe('error banner', () => {
    it('is not rendered when no errors', () => {
      const component = renderLayout({hasError: false, errorCount: 0})
      expect(component.find('PageError').exists()).toEqual(false)
    })
    describe('generic errors', () => {
      it('is rendered when generic error occurs', () => {
        const component = renderLayout({hasError: true})
        expect(component.find('PageError').exists()).toEqual(true)
      })
    })
    describe('countable errors', () => {
      it('is rendered when errors count is passed', () => {
        const component = renderLayout({hasError: true, errorCount: 15})
        expect(component.find('PageError').exists()).toEqual(true)
        expect(component.find('PageError').props().errorCount).toEqual(15)
      })
    })
  })
})
