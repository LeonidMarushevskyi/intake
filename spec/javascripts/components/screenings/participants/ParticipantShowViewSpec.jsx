import Immutable from 'immutable'
import ParticipantShowView from 'screenings/ParticipantShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantShowView', () => {
  const requiredParticipantProps = {
    legacy_descriptor: {},
  }

  it('renders the participants full name', () => {
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '200',
      first_name: 'Kevin',
      middle_name: 'Home Alone',
      last_name: 'McCallister',
      name_suffix: 'iv',
    })
    const component = shallow(<ParticipantShowView participant={participant} />)
    expect(component.find('ShowField[label="Name"]').html()).toContain('Kevin Home Alone McCallister IV')
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
    const component = shallow(<ParticipantShowView participant={participant} />)
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
    const component = shallow(<ParticipantShowView participant={participant} />)
    expect(component.text()).toContain('Client in CWS-CMS')
  })

  it('renders the default avatar', () => {
    const component = shallow(<ParticipantShowView participant={Immutable.fromJS(requiredParticipantProps)} />)
    expect(component.find('img').props().src).toContain('/default-profile.svg')
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
      races: [{race: 'White', race_detail: 'Middle Eastern'}],
      roles: ['soccer coach', 'The doctor'],
      languages: ['English', 'Arabic'],
      date_of_birth: '1990-11-16',
      ssn: '111-22-33__',
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: 'Mexican',
      },
    })
    const component = shallow(<ParticipantShowView participant={participant} />)
    expect(component.find('ShowField').length).toEqual(8)
    expect(component.find('ShowField[label="Name"]').html())
      .toContain('Kevin Home Alone McCallister IV')
    expect(component.find('ShowField[label="Gender"]').html())
      .toContain('Male')
    expect(component.find('ShowField[label="Role(s)"]').html())
      .toContain('soccer coach', 'The doctor')
    expect(component.find('ShowField[label="Language(s) (Primary First)"]').html())
      .toContain('English (Primary), Arabic')
    expect(component.find('ShowField[label="Date of birth"]').html())
      .toContain('11/16/1990')
    expect(component.find('ShowField[label="Social security number"]').html())
      .toContain('111-22-33  ')
    expect(component.find('ShowField[label="Race"]').html())
      .toContain('White - Middle Eastern')
    expect(component.find('ShowField[label="Hispanic/Latino Origin"]').html())
      .toContain('Yes - Mexican')
  })

  describe('when participant has an approximate age', () => {
    it('renders the approximate age show fields', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '200',
        approximate_age: 10,
        approximate_age_units: 'Months',
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
      expect(component.find('ShowField[label="Date of birth"]').exists()).toEqual(false)
      expect(component.find('ShowField[label="Approximate Age"]').html()).toContain('10 Months')
    })
  })

  describe('when participant has a partial name', () => {
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
      expect(component.find('ShowField[label="Name"]').html()).toContain('Unknown Person')
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
    it('renders the participant with formatted phone numbers', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '7',
        phone_numbers: [{
          id: '3',
          number: '7894561235',
          type: 'Work',
        }],
      })
      const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} />)
      expect(component.find('ShowField[label="Phone Number"]').html())
        .toContain('(789)456-1235')
      expect(component.find('ShowField[label="Phone Number Type"]').html())
        .toContain('Work')
    })
  })

  describe('when participant has races', () => {
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '7',
      races: [
        {race: 'White', race_detail: 'Romanian'},
        {race: 'Asian', race_detail: 'Chinese'},
        {race: 'Black or African American'},
      ],
    })
    const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} />)

    it('renders the participant with race information', () => {
      expect(component.find('.row ShowField[label="Race"]').html())
        .toContain('White - Romanian, Asian - Chinese, Black or African American')
    })
  })
})
