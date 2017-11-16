import {App} from 'common/App'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('App', () => {
  let actions
  let component

  beforeEach(() => {
    actions = {
      fetch: jasmine.createSpy('fetch'),
    }
  })

  it('fetches the system codes when the component mounts', () => {
    mount(<App actions={actions}><div/></App>)
    expect(actions.fetch).toHaveBeenCalled()
  })

  describe('http errors', () => {
    it('are rendered when present', () => {
      const remoteError = {why: 'Low quality plan'}
      component = shallow(<App actions={actions} remoteError={remoteError}><div/></App>)
      expect(component.find('PageError').exists()).toEqual(true)
      expect(component.find('.page-has-error').exists()).toEqual(true)
    })
    it('are not rendered when absent', () => {
      component = shallow(<App actions={actions}><div/></App>)
      expect(component.find('PageError').exists()).toEqual(false)
      expect(component.find('.page-has-remote-error').exists()).toEqual(false)
    })
    it('are not rendered when empty', () => {
      const remoteError = {}
      component = shallow(<App actions={actions} remoteError={remoteError}><div/></App>)
      expect(component.find('PageError').exists()).toEqual(false)
      expect(component.find('.page-has-error').exists()).toEqual(false)
    })
  })
})
