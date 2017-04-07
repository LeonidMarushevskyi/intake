import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'
import {HomePage} from 'components/HomePage'
import {shallow} from 'enzyme'

const stubRequest = (mockData) => {
  const screeningIndexSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
  spyOn(Utils, 'request').and.returnValue(screeningIndexSpyObj)
  screeningIndexSpyObj.then.and.callFake((then) => then(mockData))
  Utils.request.and.returnValue(screeningIndexSpyObj)
}

describe('HomePage', () => {
  let component
  let createScreening
  const mockScreenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
  let routerSpy
  let props
  beforeEach(() => {
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    promiseSpyObj.then.and.callFake((then) => then())
    createScreening = jasmine.createSpy('createScreening')
    createScreening.and.returnValue(promiseSpyObj)
    routerSpy = jasmine.createSpyObj('routerSpy', ['push'])
    props = {
      actions: {createScreening},
      screening: Immutable.Map({id: '1'}),
      router: routerSpy,
    }
    component = shallow(<HomePage {...props} />)
  })

  it('gets screenings and sets state when rendered', () => {
    stubRequest(mockScreenings)
    const instance = shallow(<HomePage {...props}/>).instance()
    spyOn(instance, 'setState').and.callThrough()
    instance.componentDidMount()
    expect(instance.setState).toHaveBeenCalledWith({screenings: mockScreenings})
  })

  it('state.screenings are sent to the screenings table', () => {
    const component = shallow(<HomePage {...props} />)
    component.setState({screenings: mockScreenings})
    const table = component.find('ScreeningsTable')
    expect(table.props().screenings).toEqual(mockScreenings)
  })

  it('renders the create screening link', () => {
    const createScreeningLink = component.find('Link')
    expect(createScreeningLink.props().children).toEqual('Start Screening')
  })

  it('sends a POST request to the server and redirects to edit', () => {
    const createScreeningLink = component.find('Link')
    createScreeningLink.simulate('click')
    expect(createScreening).toHaveBeenCalled()
    expect(routerSpy.push).toHaveBeenCalledWith({pathname: '/screenings/1/edit'})
  })

  it('renders the screening index table', () => {
    expect(component.find('ScreeningsTable').length).toEqual(1)
  })
})
