import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'
import React from 'react'
import ScreeningShowPage from 'components/screenings/ScreeningShowPage'
import {shallow} from 'enzyme'

describe('ScreeningShowPage', () => {
  let component
  const props = {params: {id: 1}}
  const screeningWithRequiredAttributes = {
    participants: [],
    report_narrative: 'A Sample Narrative',
  }
  const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])

  describe('render', () => {
    beforeEach(() => {
      spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.callFake((afterThen) => afterThen(screeningWithRequiredAttributes))
      component = shallow(<ScreeningShowPage {...props} />)
    })

    it('renders the screening reference', () => {
      component.setState({
        screening: Immutable.fromJS({
          reference: 'The Rocky Horror Picture Show',
          participants: [],
        }),
      })
      expect(component.find('h1').text()).toEqual('Screening #The Rocky Horror Picture Show')
    })

    it('renders the home and edit link', () => {
      const homeLink = component.find({to: '/'})
      const editLink = component.find({to: '/screenings/1/edit'})
      expect(homeLink.html()).toContain('Home')
      expect(editLink.html()).toContain('Edit')
    })

    it('render show views', () => {
      const screening = Immutable.fromJS({participants: []})
      component.setState({screening: screening})
      expect(component.find('InformationShowView').length).toEqual(1)
      expect(component.find('ReferralInformationShowView').length).toEqual(1)
    })

    describe('participants card', () => {
      it('renders the participants card for each participant', () => {
        const participants = [
          {id: 1, first_name: 'Rodney', last_name: 'Mullens'},
          {id: 5, first_name: 'Tony', last_name: 'Hawk'},
        ]
        const screening = Immutable.fromJS({participants: participants})
        component.setState({screening: screening})
        expect(component.find('ParticipantCardView').length).toEqual(2)
        expect(component.find('ParticipantCardView').nodes.map((ele) => ele.props.mode)).toEqual(
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
        component.setState({
          screening: screening,
          loaded: true,
        })
      })

      it('renders the narrative card', () => {
        expect(component.find('NarrativeCardView').length).toEqual(1)
      })

      it('has screening passed in props', () => {
        expect(component.find('NarrativeCardView').props().narrative).toEqual(
          'this is a narrative report'
        )
      })

      it('has mode set to show', () => {
        expect(component.find('NarrativeCardView').props().mode).toEqual('show')
      })
    })
  })

  describe('fetch', () => {
    let component
    beforeEach(() => {
      promiseSpyObj.then.and.callFake((then) => then(screeningWithRequiredAttributes))
      spyOn(screeningActions, 'fetch').and.returnValue(promiseSpyObj)
      component = shallow(<ScreeningShowPage {...props} />)
    })

    it('GETs the screening from the server', () => {
      component.instance().fetch()
      expect(screeningActions.fetch).toHaveBeenCalledWith(1)
    })
  })

  describe('cardSave', () => {
    let component
    beforeEach(() => {
      promiseSpyObj.then.and.callFake((then) => then(screeningWithRequiredAttributes))
      spyOn(screeningActions, 'save').and.returnValue(promiseSpyObj)
      component = shallow(<ScreeningShowPage {...props} />)
    })

    it('calls screening save', () => {
      component.instance().cardSave(['report_narrative'], 'This is my new narrative')
      expect(screeningActions.save).toHaveBeenCalled()
    })
  })
})
