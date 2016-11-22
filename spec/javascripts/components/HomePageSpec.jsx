import * as screeningActions from 'actions/screeningActions'
import {shallow} from 'enzyme'
import {browserHistory} from 'react-router'
import HomePage from 'components/HomePage'
import React from 'react'

describe('HomePage', () => {
  let wrapper
  beforeEach(() => {
    const jsonResponse = {id: '1'}
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    promiseSpyObj.then.and.callFake((then) => then(jsonResponse))
    spyOn(screeningActions, 'create').and.returnValue(promiseSpyObj)
    spyOn(browserHistory, 'push')
    wrapper = shallow(<HomePage />)
  })

  it('renders the create screening link', () => {
    const createScreeningLink = wrapper.find('a[href="#"]')
    expect(createScreeningLink.text()).toEqual('Start Screening')
  })

  it('renders the create person link', () => {
    const createPersonLink = wrapper.find('Link[to="/people/new"]')
    expect(createPersonLink.html()).toContain('Create Person')
  })

  it('renders the screening index link', () => {
    const screeningIndexLink = wrapper.find('Link[to="/screenings"]')
    expect(screeningIndexLink.html()).toContain('Screenings')
  })

  it('sends a POST request to the server and redirects to edit', () => {
    const createScreeningLink = wrapper.find('a[href="#"]')
    createScreeningLink.simulate('click')
    expect(screeningActions.create).toHaveBeenCalled()
    expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/screenings/1/edit'})
  })
})
