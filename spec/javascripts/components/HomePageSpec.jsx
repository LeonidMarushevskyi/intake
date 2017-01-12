import Immutable from 'immutable'
import React from 'react'
import {HomePage} from 'components/HomePage'
import {browserHistory} from 'react-router'
import {shallow} from 'enzyme'

describe('HomePage', () => {
  let component
  let createScreening
  beforeEach(() => {
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    promiseSpyObj.then.and.callFake((then) => then())
    createScreening = jasmine.createSpy('createScreening')
    createScreening.and.returnValue(promiseSpyObj)

    spyOn(browserHistory, 'push')
    const props = {
      actions: {createScreening},
      screening: Immutable.Map({id: '1'}),
    }
    component = shallow(<HomePage {...props} />)
  })

  it('renders the create screening link', () => {
    const createScreeningLink = component.find('a[href="#"]')
    expect(createScreeningLink.text()).toEqual('Start Screening')
  })

  it('renders the create person link', () => {
    const createPersonLink = component.find('Link[to="/people/new"]')
    expect(createPersonLink.html()).toContain('Create Person')
  })

  it('renders the screening index link', () => {
    const screeningIndexLink = component.find('Link[to="/screenings"]')
    expect(screeningIndexLink.html()).toContain('Screenings')
  })

  it('sends a POST request to the server and redirects to edit', () => {
    const createScreeningLink = component.find('a[href="#"]')
    createScreeningLink.simulate('click')
    expect(createScreening).toHaveBeenCalled()
    expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/screenings/1/edit'})
  })
})
