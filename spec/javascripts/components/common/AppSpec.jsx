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

  describe('error banner', () => {
    it('is not rendered when no errors', () => {
      component = shallow(<App actions={actions} hasError={false} errorCount={0}><div/></App>)
      expect(component.find('PageError').exists()).toEqual(false)
    })
    describe('generic errors', () => {
      it('is rendered when generic error occurs', () => {
        component = shallow(<App actions={actions} hasError={true}><div/></App>)
        expect(component.find('PageError').exists()).toEqual(true)
      })
    })
    describe('countable errors', () => {
      it('is rendered when errors count is passed', () => {
        component = shallow(<App actions={actions} hasError={true} errorCount={15}><div/></App>)
        expect(component.find('PageError').exists()).toEqual(true)
        expect(component.find('PageError').props().errorCount).toEqual(15)
      })
    })
  })
})
