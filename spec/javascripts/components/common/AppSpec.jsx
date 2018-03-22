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
    const checkStaffPermissions = jasmine.createSpy('checkStaffPermissions')
    const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermissions}
    mount(<App actions={actions}><div/></App>)
    expect(fetchUserInfoAction).toHaveBeenCalled()
    expect(fetchSystemCodesAction).toHaveBeenCalled()
    expect(checkStaffPermissions).toHaveBeenCalledWith(['add_sensitive_people', 'can_see_hotline', 'can_see_snapshot'])
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
