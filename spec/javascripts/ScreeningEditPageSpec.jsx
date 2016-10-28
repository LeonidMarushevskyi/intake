import * as Utils from 'utils/http'
import Immutable from 'immutable'
import ScreeningEditPage from 'ScreeningEditPage'
import React from 'react'
import {mount} from 'enzyme'

describe('ScreeningEditPage', () => {
  let xhrSpyObject
  beforeEach(() => {
    xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)
  })

  describe('render', () => {
    let wrapper
    beforeEach(() => {
      const props = {params: {id: 1}}
      wrapper = mount(<ScreeningEditPage {...props} />)
    })

    describe('screening information card', () => {
      it('renders the card header', () => {
        expect(wrapper.find('#screening-information-card .card-header').text()).toEqual('Screening Information')
      })

      it('render the labels', () => {
        const labels = wrapper.find('#screening-information-card label')

        expect(labels.length).toEqual(4)
        expect(labels.map((element) => element.text())).toEqual([
          'Title/Name of Screening',
          'Screening Start Date/Time',
          'Screening End Date/Time',
          'Communication Method',
        ])
      })

      it('render the fields', () => {
        wrapper.setState({
          screening: Immutable.fromJS({
            name: 'The Rocky Horror Picture Show',
            started_at: '2016-08-13T10:00:00.000Z',
            ended_at: '2016-08-22T11:00:00.000Z',
            communication_method: 'mail',
            participants: [],
          }),
        })
        const inputs = wrapper.find('#screening-information-card input')

        expect(inputs.length).toEqual(3)
        expect(inputs.map((element) => element.props().value)).toEqual([
          'The Rocky Horror Picture Show',
          '2016-08-13T10:00:00.000Z',
          '2016-08-22T11:00:00.000Z',
        ])

        expect(wrapper.find('#screening-information-card select').props().value).toEqual('mail')
      })
    })

    describe('participants card', () => {
      it('renders the card header', () => {
        expect(wrapper.find('#participants-card .card-header').text()).toContain('Participants')
      })

      it('renders the participant label', () => {
        expect(wrapper.find('#participants-card label').text()).toEqual('Participants')
      })

      it('renders the autocompleter', () => {
        expect(wrapper.find('Autocompleter').props().id).toEqual('screening_participants')
        expect(wrapper.find('Autocompleter').props().onSelect).toEqual(
          wrapper.instance().addParticipant
        )
      })

      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Melissa', last_name: 'Powers'},
          {id: 2, first_name: 'Marshall', last_name: 'Powers'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        wrapper.setState({screening: screening})
        expect(wrapper.find('ParticipantCardView').length).toEqual(2)
        expect(wrapper.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
          ['edit', 'edit']
        )
      })
    })

    describe('narrative card', () => {
      it('renders the narrative card header', () => {
        expect(wrapper.find('#narrative-card .card-header').text()).toEqual('Narrative')
      })

      it('renders the report narrative textarea', () => {
        wrapper.setState({
          screening: Immutable.fromJS({
            report_narrative: 'some narrative',
            participants: [],
          }),
        })
        expect(wrapper.find('textarea').text()).toEqual('some narrative')
      })
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />)
      wrapper.instance().fetch()
      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
    })
  })

  describe('addParticipant', () => {
    it('adds the participant to an empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(1)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
    })

    it('adds the participant to a non empty list of participants', () => {
      const props = {params: {id: 1}}
      const wrapper = mount(<ScreeningEditPage {...props} />).instance()
      wrapper.addParticipant({id: 1})
      wrapper.addParticipant({id: 2})
      const participants = wrapper.state.screening.get('participants')
      expect(participants.size).toEqual(2)
      expect(participants.get(0)).toEqual(Immutable.Map({id: 1}))
      expect(participants.get(1)).toEqual(Immutable.Map({id: 2}))
    })
  })
})
