import * as Utils from 'utils/http'
import {shallow} from 'enzyme'
import {browserHistory} from 'react-router'
import HomePage from 'components/HomePage'
import React from 'react'

describe('HomePage', () => {
  let promiseSpyObj
  beforeEach(() => {
    promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    spyOn(Utils, 'request').and.returnValue(promiseSpyObj)
    spyOn(browserHistory, 'push')
  })

  it('render links', () => {
    const wrapper = shallow(<HomePage />)
    const links = wrapper.find('Link')

    expect(wrapper.find('a').text()).toEqual('Start Screening')
    expect(links.map((element) => [element.props().to, element.props().children])).toEqual([
      ['/people/new', 'Create Person'],
      ['/screenings', 'Screenings'],
    ])
  })

  it('sends a POST request to the server and redirects to edit', () => {
    const jsonResponse = {id: '1'}
    promiseSpyObj.then.and.callFake((then) => then(jsonResponse))

    const wrapper = shallow(<HomePage />)
    wrapper.find('a').simulate('click')
    expect(Utils.request).toHaveBeenCalled()
    expect(Utils.request.calls.argsFor(0)[0]).toEqual('POST')
    expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings.json')
    expect(browserHistory.push).toHaveBeenCalledWith({pathname: '/screenings/1/edit'})
  })
})
