import * as Utils from 'utils/http'
import * as screeningActions from 'actions/screening'
import Immutable from 'immutable'
import React from 'react'
import ScreeningShowPage from 'components/screenings/ScreeningShowPage'
import {shallow} from 'enzyme'

describe('ScreeningShowPage', () => {
  let wrapper
  let promiseSpyObj
  beforeEach(() => {
    promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
    spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
    const props = {params: {id: 1}}
    wrapper = shallow(<ScreeningShowPage {...props} />)
  })

  describe('render', () => {
    it('renders the screening reference', () => {
      wrapper.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          participants: []
        })
      })
      expect(wrapper.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      const homeLink = wrapper.find({to: '/'})
      const editLink = wrapper.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('render show views', () => {
      const screening = Immutable.fromJS({participants: []})
      wrapper.setState({screening: screening})
      expect(wrapper.find('InformationShowView').length).toEqual(1)
      expect(wrapper.find('ReferralInformationShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Rodney', last_name: 'Mullens'},
          {id: 5, first_name: 'Tony', last_name: 'Hawk'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        wrapper.setState({screening: screening})
        expect(wrapper.find('ParticipantCardView').length).toEqual(2)
        expect(wrapper.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['show', 'show']
        )
      })
    })

    describe('narrative card', () => {
      let screening
      beforeEach(() => {
        screening = Immutable.fromJS({
          report_narrative: 'this is a narrative report',
          participants: [],
        })
        wrapper.setState({screening: screening})
      })

      it('renders the narrative card', () => {
        expect(wrapper.find('NarrativeCardView').length).toEqual(1)
      })

      it('has screening passed in props', () => {
        expect(wrapper.find('NarrativeCardView').props().narrative).toEqual(
          screening.get('report_narrative')
        )
      })

      it('has mode set to show', () => {
        expect(wrapper.find('NarrativeCardView').props().mode).toEqual('show')
      })
    })
  })

  describe('fetch', () => {
    let wrapper
    beforeEach(() => {
      const screening = {id: 1, participants: []}
      promiseSpyObj.then.and.callFake((then) => then(screening))
      spyOn(screeningActions, 'save').and.returnValue(promiseSpyObj)
      const props = {params: {id: 1}}
      wrapper = shallow(<ScreeningShowPage {...props} />)
    })

    it('GETs the screening data from the server', () => {
      wrapper.instance().fetch()
      expect(screeningActions.fetch).toHaveBeenCalledWith(1)
    })
  })

  describe('cardSave', () => {
    let wrapper
    beforeEach(() => {
      const screening = {id: 1, participants: []}
      promiseSpyObj.then.and.callFake((then) => then(screening))
      spyOn(screeningActions, 'save').and.returnValue(promiseSpyObj)
      const props = {params: {id: 1}}
      wrapper = shallow(<ScreeningShowPage {...props} />)
    })

    it('calls screening save', () => {
      wrapper.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(screeningActions.save).toHaveBeenCalled()
    })
  })
})
