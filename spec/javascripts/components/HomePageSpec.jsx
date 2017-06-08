import * as Utils from 'utils/http'
import Immutable from 'immutable'
import React from 'react'
import {HomePage} from 'components/HomePage'
import {shallow} from 'enzyme'

describe('HomePage', () => {
  let component
  let props
  beforeEach(() => {
    props = {
      actions: {},
      screening: Immutable.Map(),
      router: {},
    }
  })

  describe('#componentDidMount', () => {
    const mockScreenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
    let instance
    beforeEach((done) => {
      spyOn(Utils, 'request').and.returnValue(Promise.resolve(mockScreenings))
      instance = shallow(<HomePage {...props}/>).instance()
      spyOn(instance, 'setState').and.callFake(done)
      instance.componentDidMount()
    })

    it('fetches the screenings', () => {
      expect(Utils.request).toHaveBeenCalledWith('GET', '/api/v1/screenings')
    })

    it('sets the screening state with the fetched screenings', () => {
      expect(instance.setState).toHaveBeenCalledWith({screenings: mockScreenings})
    })
  })

  it('renders the create screening link', () => {
    component = shallow(<HomePage {...props} />)
    const createScreeningLink = component.find('Link')
    expect(createScreeningLink.props().children).toEqual('Start Screening')
  })

  it('renders the screening index table', () => {
    component = shallow(<HomePage {...props} />)
    expect(component.find('ScreeningsTable').length).toEqual(1)
  })

  it('renders the screening index table when screenings are present', () => {
    const mockScreenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
    const component = shallow(<HomePage {...props} />)
    component.setState({screenings: mockScreenings})
    const table = component.find('ScreeningsTable')
    expect(table.props().screenings).toEqual(mockScreenings)
  })

  describe('when a user creates a new screening', () => {
    let createScreening
    let router
    beforeEach((done) => {
      createScreening = jasmine.createSpy('createScreening')
      createScreening.and.returnValue(Promise.resolve())
      router = jasmine.createSpyObj('routerSpy', ['push'])
      props = {
        actions: {createScreening},
        screening: Immutable.Map({id: '1'}),
        router,
      }
      component = shallow(<HomePage {...props} />)
      const createScreeningLink = component.find('Link')
      createScreeningLink.simulate('click')
      router.push.and.callFake(done)
    })

    it('sends a POST request to the server and redirects to edit', () => {
      expect(createScreening).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith({pathname: '/screenings/1/edit'})
    })
  })
})
