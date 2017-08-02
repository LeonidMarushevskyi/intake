import Immutable from 'immutable'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
import React from 'react'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'config'

describe('ParticipantShowView', () => {
  const requiredParticipantProps = {
    legacy_descriptor: {},
  }

  describe('when release two is inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    })

    it('renders a participant show view card', () => {
      const participant = Immutable.fromJS({...requiredParticipantProps, id: '200'})
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('.card.show').length).toEqual(1)
      expect(component.find('#participants-card-200').length).toEqual(1)
    })

    it('renders the participants full name', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        last_name: 'McCallister',
        name_suffix: 'iv',
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('.card-header').text()).toContain('Kevin Home Alone McCallister IV')
    })

    it('renders the participant legacy id and table', () => {
      const participant = Immutable.fromJS({
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        legacy_descriptor: {
          legacy_ui_id: '123-456-789',
          legacy_table_description: 'Client',
        },
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.text()).toContain('Client ID 123-456-789 in CWS-CMS')
    })

    it('renders the participant legacy table when there is no id', () => {
      const participant = Immutable.fromJS({
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        legacy_descriptor: {
          legacy_table_description: 'Client',
        },
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.text()).toContain('Client in CWS-CMS')
    })

    it('renders properly when there is no legacy id nor legacy table', () => {
      const participant = Immutable.fromJS({
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        legacy_descriptor: {},
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.text()).not.toContain('in CWS-CMS')
    })

    it('renders the delete link', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('.fa-times').length).toEqual(1)
    })

    it('renders the edit link', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('EditLink').props().ariaLabel).toEqual('Edit participant')
    })

    it('renders the default avatar', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('img').props().src).toEqual('/assets/default-profile.svg')
    })

    it('renders the participant show fields', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        last_name: 'McCallister',
        name_suffix: 'iv',
        gender: 'male',
        languages: ['English', 'Arabic'],
        date_of_birth: '1990-11-16',
        ssn: '111-22-33__',
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('ShowField').length).toEqual(5)
      expect(component.find('ShowField[label="Name"]').html())
        .toContain('Kevin Home Alone McCallister IV')
      expect(component.find('ShowField[label="Gender"]').html())
        .toContain('Male')
      expect(component.find('ShowField[label="Language(s)"]').html())
        .toContain('English, Arabic')
      expect(component.find('ShowField[label="Date of birth"]').html())
        .toContain('11/16/1990')
      expect(component.find('ShowField[label="Social security number"]').html())
        .toContain('111-22-33  ')
    })

    it('calls the onEdit function when edit link is clicked', () => {
      const onEdit = jasmine.createSpy()
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={onEdit}/>)
      component.find('EditLink').simulate('click')
      expect(onEdit).toHaveBeenCalled()
    })

    it('calls the onDelete function when delete link is clicked', () => {
      const onDelete = jasmine.createSpy('onDelete')
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => {}} onDelete={onDelete}/>)
      component.find('.delete-button').simulate('click')
      expect(onDelete).toHaveBeenCalled()
    })

    describe('when participant has a partial name', () => {
      it('renders the participant header correctly with null last name', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: 'Kevin',
          last_name: null,
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').text()).toContain('Kevin (Unknown last name)')
      })

      it('renders the participant header correctly with null first name', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: null,
          last_name: 'McAllister',
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').text()).toContain('(Unknown first name) McAllister')
      })

      it('renders the participant name show fields', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: 'Kevin',
          last_name: null,
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('ShowField[label="Name"]').html()).not.toContain('null')
      })
    })

    describe('when participant has no name', () => {
      it('does not render when not present', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: null,
          last_name: null,
          gender: 'male',
          date_of_birth: '1990-11-16',
          ssn: '111223333',
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').html()).toContain('Unknown Person')
      })
    })

    describe('when participant has addresses', () => {
      it('renders participant with address', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '5',
          addresses: [{
            id: '1',
            street_address: '671 Lincoln Avenue',
            city: 'Winnetka',
            state: 'IL',
            zip: '60093',
            type: 'Work',
          }],
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('ShowField[label="Address"]').html())
          .toContain('671 Lincoln Avenue')
        expect(component.find('ShowField[label="City"]').html())
          .toContain('Winnetka')
        expect(component.find('ShowField[label="State"]').html())
          .toContain('Illinois')
        expect(component.find('ShowField[label="Zip"]').html())
          .toContain('60093')
        expect(component.find('ShowField[label="Address Type"]').html())
          .toContain('Work')
      })
    })

    describe('when participant has phone numbers', () => {
      it('renders the participant with phone numbers', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '7',
          phone_numbers: [{
            id: '3',
            number: '789-456-1235',
            type: 'Work',
          }],
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} />)
        expect(component.find('ShowField[label="Phone Number"]').html())
          .toContain('789-456-1235')
        expect(component.find('ShowField[label="Phone Number Type"]').html())
          .toContain('Work')
      })
    })
  })

  describe('when release two is active', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(false)
    })

    it('renders a participant show view card', () => {
      const participant = Immutable.fromJS({...requiredParticipantProps, id: '200'})
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('.card.show').length).toEqual(1)
      expect(component.find('#participants-card-200').length).toEqual(1)
    })

    it('renders the participants full name', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        last_name: 'McCallister',
        name_suffix: 'iv',
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('.card-header').text()).toContain('Kevin Home Alone McCallister IV')
    })

    it('renders the delete link', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('.fa-times').length).toEqual(1)
    })

    it('does not render the edit link', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('EditLink').length).toEqual(0)
    })

    it('renders the default avatar', () => {
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => null}/>)
      expect(component.find('img').props().src).toEqual('/assets/default-profile.svg')
    })

    it('renders the participant show fields', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '200',
        first_name: 'Kevin',
        middle_name: 'Home Alone',
        last_name: 'McCallister',
        name_suffix: 'iv',
        gender: 'male',
        languages: ['English', 'Arabic'],
        date_of_birth: '1990-11-16',
        ssn: '111-22-33__',
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => null}/>)
      expect(component.find('ShowField').length).toEqual(5)
      expect(component.find('ShowField[label="Name"]').html())
        .toContain('Kevin Home Alone McCallister IV')
      expect(component.find('ShowField[label="Gender"]').html())
        .toContain('Male')
      expect(component.find('ShowField[label="Language(s)"]').html())
        .toContain('English, Arabic')
      expect(component.find('ShowField[label="Date of birth"]').html())
        .toContain('11/16/1990')
      expect(component.find('ShowField[label="Social security number"]').html())
        .toContain('111-22-33  ')
    })

    it('calls the onDelete function when delete link is clicked', () => {
      const onDelete = jasmine.createSpy('onDelete')
      const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} onEdit={() => {}} onDelete={onDelete}/>)
      component.find('.delete-button').simulate('click')
      expect(onDelete).toHaveBeenCalled()
    })

    describe('when participant has a partial name', () => {
      it('renders the participant header correctly with null last name', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: 'Kevin',
          last_name: null,
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').text()).toContain('Kevin (Unknown last name)')
      })

      it('renders the participant header correctly with null first name', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: null,
          last_name: 'McAllister',
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').text()).toContain('(Unknown first name) McAllister')
      })

      it('renders the participant name show fields', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: 'Kevin',
          last_name: null,
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('ShowField[label="Name"]').html()).not.toContain('null')
      })
    })

    describe('when participant has no name', () => {
      it('does not render when not present', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '200',
          first_name: null,
          last_name: null,
          gender: 'male',
          date_of_birth: '1990-11-16',
          ssn: '111223333',
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('.card-header').html()).toContain('Unknown Person')
      })
    })

    describe('when participant has addresses', () => {
      it('renders participant with address', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '5',
          addresses: [{
            id: '1',
            street_address: '671 Lincoln Avenue',
            city: 'Winnetka',
            state: 'IL',
            zip: '60093',
            type: 'Work',
          }],
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
        expect(component.find('ShowField[label="Address"]').html())
          .toContain('671 Lincoln Avenue')
        expect(component.find('ShowField[label="City"]').html())
          .toContain('Winnetka')
        expect(component.find('ShowField[label="State"]').html())
          .toContain('Illinois')
        expect(component.find('ShowField[label="Zip"]').html())
          .toContain('60093')
        expect(component.find('ShowField[label="Address Type"]').html())
          .toContain('Work')
      })
    })

    describe('when participant has phone numbers', () => {
      it('renders the participant with phone numbers', () => {
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: '7',
          phone_numbers: [{
            id: '3',
            number: '789-456-1235',
            type: 'Work',
          }],
        })
        const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} />)
        expect(component.find('ShowField[label="Phone Number"]').html())
          .toContain('789-456-1235')
        expect(component.find('ShowField[label="Phone Number Type"]').html())
          .toContain('Work')
      })
    })
  })
})
