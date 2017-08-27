import * as Utils from 'utils/http'
import {fromJS, Map} from 'immutable'
import React from 'react'
import {HomePage} from 'home/HomePage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('HomePage', () => {
  let component
  const requiredProps = {
    actions: {},
    screening: Map(),
    router: {},
  }

  describe('when release_two is inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive')
      IntakeConfig.isFeatureInactive.and.returnValue(true)
    })

    describe('#componentWillReceiveProps', () => {
      let router
      const screening = fromJS({id: 1})
      beforeEach(() => {
        router = jasmine.createSpyObj('router', ['push'])
        component = shallow(
          <HomePage actions={{}} screening={screening} router={router} />
        )
      })

      describe('when nextProps contains a screening not equal to previous screening', () => {
        beforeEach(() => {
          const newScreening = fromJS({id: 12})
          component.setProps({screening: newScreening})
        })

        it('routes to the new screening', () => {
          expect(router.push).toHaveBeenCalledWith({pathname: '/screenings/12/edit'})
        })
      })

      describe('when nextProps contains a screening equal to previous screening', () => {
        beforeEach(() => {
          component.setProps({screening})
        })

        it('does not route to screening', () => {
          expect(router.push).not.toHaveBeenCalled()
        })
      })

      describe('when nextProps contains a screening that is empty', () => {
        beforeEach(() => {
          component.setProps({screening: Map()})
        })

        it('does not route to screening', () => {
          expect(router.push).not.toHaveBeenCalled()
        })
      })
    })

    describe('#componentDidMount', () => {
      const mockScreenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
      let instance
      beforeEach((done) => {
        spyOn(Utils, 'get').and.returnValue(Promise.resolve(mockScreenings))
        instance = shallow(<HomePage {...requiredProps}/>).instance()
        spyOn(instance, 'setState').and.callFake(done)
        instance.componentDidMount()
      })

      it('fetches the screenings', () => {
        expect(Utils.get).toHaveBeenCalledWith('/api/v1/screenings')
      })

      it('sets the screening state with the fetched screenings', () => {
        expect(instance.setState).toHaveBeenCalledWith({screenings: mockScreenings})
      })
    })

    it('renders the create screening link', () => {
      component = shallow(<HomePage {...requiredProps} />)
      const createScreeningLink = component.find('Link')
      expect(createScreeningLink.props().children).toEqual('Start Screening')
    })

    it('renders the screening index table', () => {
      component = shallow(<HomePage {...requiredProps} />)
      expect(component.find('ScreeningsTable').length).toEqual(1)
    })

    it('renders the screening index table when screenings are present', () => {
      const mockScreenings = [{id: 1, name: 'Name 1', reference: 'ref1', started_at: '2016-08-11T18:24:22.157Z'}]
      component = shallow(<HomePage {...requiredProps} />)
      component.setState({screenings: mockScreenings})
      const table = component.find('ScreeningsTable')
      expect(table.props().screenings).toEqual(mockScreenings)
    })

    describe('when a user creates a new screening', () => {
      let createScreening
      beforeEach(() => {
        createScreening = jasmine.createSpy('createScreening')
        component = shallow(
          <HomePage
            actions={{createScreening}}
            screening={Map({id: '1'})}
            router={{}}
          />
        )
        const createScreeningLink = component.find('Link')
        createScreeningLink.simulate('click')
      })

      it('calls the create screening action', () => {
        expect(createScreening).toHaveBeenCalled()
      })
    })
  })

  describe('when release_two feature is not inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive')
      IntakeConfig.isFeatureInactive.and.returnValue(false)
    })

    it('does not render the screenings table', () => {
      const component = shallow(<HomePage {...requiredProps} />)
      const table = component.find('ScreeningsTable')
      expect(table.length).toEqual(0)
    })

    describe('#componentDidMount', () => {
      beforeEach(() => {
        spyOn(Utils, 'get')
        const instance = shallow(<HomePage {...requiredProps}/>).instance()
        instance.componentDidMount()
      })

      it('does not fetch the screenings', () => {
        expect(Utils.get).not.toHaveBeenCalledWith('/api/v1/screenings')
      })
    })
  })
})
