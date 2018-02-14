import {App} from 'common/App'
import React from 'react'
import {shallow, mount} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('App', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'config').and.returnValue({base_path: 'intake'})
  })

  it('fetches user info when the component mounts', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
    const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}
    mount(<App actions={actions}><div/></App>)
    expect(fetchUserInfoAction).toHaveBeenCalled()
    expect(fetchSystemCodesAction).toHaveBeenCalled()
    expect(checkStaffPermission).toHaveBeenCalledWith('add_sensitive_people')
  })

  it('renders the global header component on all app views', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find('GlobalHeader').exists()).toBe(true)
  })

  it('renders its children', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find('div').exists()).toBe(true)
  })
})
