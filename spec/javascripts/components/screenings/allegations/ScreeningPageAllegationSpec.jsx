import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {mount, shallow} from 'enzyme'
import {requiredProps, requiredScreeningAttributes} from '../ScreeningPageSpec'

describe('ScreeningPage', () => {
  beforeEach(() => {
    const sdmPath = 'https://ca.sdmdata.org'
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    spyOn(IntakeConfig, 'basePath').and.returnValue('/')
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
  })

  describe('allegations', () => {
    const victim = {
      id: '1',
      first_name: 'Bart',
      last_name: 'Simpson',
      roles: ['Victim'],
    }
    const perpetrator = {
      id: '2',
      first_name: 'Homer',
      last_name: 'Simpson',
      roles: ['Perpetrator'],
    }

    const saveScreening = jasmine.createSpy('saveScreening')

    const props = {
      ...requiredProps,
      mode: 'show',
      actions: {
        checkStaffPermission: () => null,
        fetchScreening: () => Promise.resolve(),
        fetchHistoryOfInvolvements: () => Promise.resolve(),
        fetchRelationships: () => Promise.resolve(),
        saveScreening,
      },
      participants: Immutable.fromJS([victim, perpetrator]),
      screening: Immutable.fromJS({
        ...requiredScreeningAttributes,
        id: '3',
        participants: [victim, perpetrator],
        allegations: [{
          id: '1',
          perpetrator_id: perpetrator.id,
          screening_id: '3',
          victim_id: victim.id,
          allegation_types: ['General neglect'],
        }],
      }),
      loaded: true,
      editable: true,
    }

    it('renders persisted allegations', () => {
      const component = mount(<ScreeningPage {...props} mode='show' />)
      const allegationsCard = component.find('AllegationsShowView')
      expect(allegationsCard.text()).toContain('Homer Simpson')
      expect(allegationsCard.text()).toContain('Bart Simpson')
      expect(allegationsCard.text()).toContain('General neglect')
    })

    it('builds and saves allegations after clicking save', () => {
      const saveScreening = jasmine.createSpy('saveScreening')
      const props = {
        ...requiredProps,
        actions: {
          checkStaffPermission: () => null,
          fetchScreening: () => Promise.resolve(),
          fetchHistoryOfInvolvements: () => Promise.resolve(),
          fetchRelationships: () => Promise.resolve(),
          saveScreening,
        },
        participants: Immutable.fromJS([victim, perpetrator]),
        mode: 'edit',
        loaded: true,
      }
      const component = mount(<ScreeningPage {...props} />)
      const allegationsCard = component.find('AllegationsEditView')
      expect(allegationsCard.length).toEqual(1)

      // React-Select doesn't fire an onChange when you simulate change on the component directly
      // When in mount mode, simulate change on the input and then simulate tabbing out of the field
      const allegationTypesSelector = allegationsCard.find('Select').find('input')
      allegationTypesSelector.simulate('change', {target: {value: 'General neglect'}})
      allegationTypesSelector.simulate('keyDown', {keyCode: 9, key: 'Tab'})

      const saveButton = allegationsCard.find('button[children="Save"]')
      expect(saveButton.length).toEqual(1)
      saveButton.simulate('click')
      expect(saveScreening).toHaveBeenCalledWith({
        id: '123456',
        allegations: [{
          id: null,
          perpetrator,
          perpetrator_id: perpetrator.id,
          screening_id: '123456',
          victim,
          victim_id: victim.id,
          allegation_types: ['General neglect'],
        }],
        cross_reports: [],
        safety_alerts: [],
      })
    })

    it('generates new allegations for the participants when there are no persisted allegations', () => {
      props.screening = props.screening.set('allegations', [])
      const component = shallow(<ScreeningPage {...props} />)
      const expectedAllegations = [{
        id: null,
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('replaces generated allegations with persisted allegations', () => {
      const persistedAllegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3'},
      ]
      props.screening = props.screening.set('allegations', Immutable.fromJS(persistedAllegations))
      const component = shallow(<ScreeningPage {...props} />)
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('interleaves generated allegations with persisted allegations', () => {
      const anotherPerpetrator = {
        id: '3',
        first_name: 'Marge',
        last_name: 'Simpson',
        roles: ['Perpetrator'],
      }
      props.participants = Immutable.fromJS([victim, perpetrator, anotherPerpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3'},
      ]
      props.screening = props.screening.set('allegations', Immutable.fromJS(persisted_allegations))
      const component = shallow(<ScreeningPage {...props} />)
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }, {
        id: null,
        screening_id: '3',
        perpetrator: anotherPerpetrator,
        perpetrator_id: anotherPerpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: [],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('uses persisted allegation types when there are no edits', () => {
      props.participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3', allegation_types: ['General neglect']},
      ]
      props.screening = props.screening.set('allegations', Immutable.fromJS(persisted_allegations))
      const component = shallow(<ScreeningPage {...props} />)
      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: ['General neglect'],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })

    it('replaces allegation types with edited allegation types', () => {
      props.participants = Immutable.fromJS([victim, perpetrator])
      const persisted_allegations = [
        {id: '9', victim_id: '1', perpetrator_id: '2', screening_id: '3', allegation_types: ['General neglect']},
      ]
      props.screening = props.screening.set('allegations', Immutable.fromJS(persisted_allegations))
      const component = shallow(<ScreeningPage {...props} />)
      const screeningEdits = Immutable.fromJS({allegations: {1: {2: ['New allegation type']}}})
      component.setState({screeningEdits})

      const expectedAllegations = [{
        id: '9',
        screening_id: '3',
        perpetrator,
        perpetrator_id: perpetrator.id,
        victim,
        victim_id: victim.id,
        allegation_types: ['New allegation type'],
      }]
      const allegationsCard = component.find('AllegationsCardView')
      expect(allegationsCard.props().allegations.toJS()).toEqual(expectedAllegations)
      expect(Immutable.is(allegationsCard.props().allegations, Immutable.fromJS(expectedAllegations))).toEqual(true)
    })
  })
})
