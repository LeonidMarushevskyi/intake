import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningShowPage} from 'components/screenings/ScreeningShowPage'
import {shallow, mount} from 'enzyme'

describe('ScreeningShowPage', () => {
  describe('render', () => {
    it('renders the screening reference', () => {
      let component
      const props = {
        params: {id: 1},
        screening: Immutable.fromJS({reference: 'The Rocky Horror Picture Show'}),
        actions: { fetchScreening: () => null }
      }
      component = shallow(<ScreeningShowPage {...props} />)
      expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      let component
      const props = {
        params: {id: 1},
        screening: Immutable.Map(),
        actions: { fetchScreening: () => null }
      }
      component = shallow(<ScreeningShowPage {...props} />)
      const homeLink = component.find({to: '/'})
      const editLink = component.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('render show views', () => {
      const props = {
        params: {id: 1},
        screening: Immutable.Map(),
        actions: { fetchScreening: () => null }
      }
      const component = shallow(<ScreeningShowPage {...props} />)
      expect(component.find('InformationShowView').length).toEqual(1)
      expect(component.find('ReferralInformationShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Rodney', last_name: 'Mullens'},
          {id: 5, first_name: 'Tony', last_name: 'Hawk'},
        ]
        const props = {
          params: {id: 1},
          screening: Immutable.fromJS({participants: participants}),
          actions: { fetchScreening: () => null }
        }
        const component = shallow(<ScreeningShowPage {...props} />)
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })
    })

    describe('narrative card', () => {
      let component
      beforeEach(() => {
        const props = {
          params: {id: 1},
          screening: Immutable.fromJS({report_narrative: 'this is a narrative report'}),
          actions: {},
        }
        component = shallow(<ScreeningShowPage {...props} />)
        component.instance().setState({loaded: true})
      })

      it('renders the narrative card', () => {
        expect(component.find('NarrativeCardView').props().narrative).toEqual(
          'this is a narrative report'
        )
        expect(component.find('NarrativeCardView').props().mode).toEqual('show')
      })
    })
  })

  describe('componentDidMount', () => {
    let component
    const fetchScreening = jasmine.createSpy('fetchScreening')
    const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    beforeEach(() => {
      const props = {
        params: { id: 222 },
        actions: { fetchScreening },
        screening: Immutable.Map(),
      }
      fetchScreening.and.returnValue(promiseSpyObj)
      component = mount(<ScreeningShowPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      expect(fetchScreening).toHaveBeenCalledWith(222)
    })
  })

  describe('cardSave', () => {
    let component
    const saveScreening = jasmine.createSpy('saveScreening')
    beforeEach(() => {
      const props = {
        params: {id: 1},
        screening: Immutable.Map(),
        actions: { saveScreening }
      }
      component = shallow(<ScreeningShowPage {...props} />)
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(saveScreening).toHaveBeenCalledWith({report_narrative: 'This is my new narrative'})
    })
  })
})
