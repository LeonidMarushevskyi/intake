import ScreeningShowPage from 'ScreeningShowPage'
import React from 'react'
import {mount} from 'enzyme'
import * as Utils from 'utils/http'
import Immutable from 'immutable'

describe('ScreeningShowPage', () => {
  let wrapper
  beforeEach(() => {
    const xhrSpyObject = jasmine.createSpyObj('xhrSpyObj', ['done'])
    spyOn(Utils, 'request').and.returnValue(xhrSpyObject)

    const props = {params: {id: 1}}
    wrapper = mount(<ScreeningShowPage {...props} />)
  })

  describe('render', () => {
    describe('screening information card', () => {
      it('render the card headers', () => {
        expect(wrapper.find('#screening-information-card .card-header').text()).toEqual('Screening Information')
      })

      it('renders the screening information label fields', () => {
        const labels = wrapper.find('#screening-information-card label')

        expect(labels.length).toEqual(4)
        expect(labels.map((element) => element.text())).toEqual([
          'Title/Name of Screening',
          'Screening Start Date/Time',
          'Screening End Date/Time',
          'Communication Method',
        ])
      })

      it('renders the screening value fields', () => {
        wrapper.setState({
          screening: Immutable.fromJS({
            name: 'The Rocky Horror Picture Show',
            started_at: '2016-08-13T10:00:00.000Z',
            ended_at: '2016-08-22T11:00:00.000Z',
            communication_method: 'mail',
            participants: [],
          }),
        })
        const values = wrapper.find('#screening-information-card .c-gray')

        expect(values.length).toEqual(4)
        expect(values.map((element) => element.text())).toEqual([
          'The Rocky Horror Picture Show',
          '08/13/2016 10:00 AM',
          '08/22/2016 11:00 AM',
          'Mail',
        ])
      })

      it('displays information correctly when they are null', () => {
        wrapper.setState({
          screening: Immutable.fromJS({
            name: null,
            started_at: null,
            ended_at: null,
            communication_method: null,
            participants: [],
          }),
        })

        expect(wrapper.find('#screening-information-card .c-gray')
          .map((element) => element.text())).toEqual(['', '', '', ''])
      })
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
      it('renders the card header', () => {
        expect(wrapper.find('#narrative-card .card-header').text()).toContain('Narrative')
      })

      it('renders the narrative label', () => {
        expect(wrapper.find('#narrative-card label').length).toEqual(1)
        expect(wrapper.find('#narrative-card label').text()).toEqual('Report Narrative')
      })

      it('renders the narrative value', () => {
        wrapper.setState({
          screening: Immutable.fromJS({
            report_narrative: 'some narrative',
            participants: [],
          }),
        })
        expect(wrapper.text()).toContain('some narrative')
      })
    })
  })

  describe('fetch', () => {
    it('GETs the screening data from the server', () => {
      wrapper.instance().fetch()

      expect(Utils.request).toHaveBeenCalled()
      expect(Utils.request.calls.argsFor(0)[0]).toEqual('GET')
      expect(Utils.request.calls.argsFor(0)[1]).toEqual('/screenings/1.json')
    })
  })
})
