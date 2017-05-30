import Immutable from 'immutable'
import ParticipantShowView from 'components/screenings/ParticipantShowView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantShowView', () => {
  let component
  let onEdit
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: '200',
      first_name: 'Kevin',
      middle_name: 'Home Alone',
      last_name: 'McCallister',
      name_suffix: 'iv',
      gender: 'male',
      languages: ['English', 'Arabic'],
      date_of_birth: '11/16/1990',
      ssn: '111-22-33__',
    })
    onEdit = jasmine.createSpy()
    component = shallow(<ParticipantShowView participant={participant} onEdit={onEdit}/>)
  })

  it('renders a participant show view card', () => {
    expect(component.find('.card.show').length).toEqual(1)
    expect(component.find('#participants-card-200').length).toEqual(1)
  })

  it('renders the participants full name', () => {
    expect(component.find('.card-header').text()).toContain('Kevin Home Alone McCallister IV')
  })

  it('renders the delete link', () => {
    expect(component.find('.fa-times').length).toEqual(1)
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit participant')
  })

  it('renders the default avatar', () => {
    expect(component.find('img').props().src).toEqual('/assets/default-profile.svg')
  })

  it('renders the participant show fields', () => {
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
    component.find('EditLink').simulate('click')
    expect(onEdit).toHaveBeenCalled()
  })

  it('calls the onDelete function when delete link is clicked', () => {
    const participant = Immutable.fromJS({
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })

    const onDelete = jasmine.createSpy('onDelete')

    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} onDelete={onDelete}/>)
    component.find('.delete-button').simulate('click')
    expect(onDelete).toHaveBeenCalled()
  })
})

describe('ParticipantShowView with partial name', () => {
  let component
  it('renders the participant header correctly with null last name', () => {
    const participant = Immutable.fromJS({
      id: '200',
      first_name: 'Kevin',
      last_name: null,
    })
    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
    expect(component.find('.card-header').text()).toContain('Kevin (Unknown last name)')
  })

  it('renders the participant header correctly with null first name', () => {
    const participant = Immutable.fromJS({
      id: '200',
      first_name: null,
      last_name: 'McAllister',
    })
    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
    expect(component.find('.card-header').text()).toContain('(Unknown first name) McAllister')
  })

  it('renders the participant name show fields', () => {
    const participant = Immutable.fromJS({
      id: '200',
      first_name: 'Kevin',
      last_name: null,
    })
    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
    expect(component.find('ShowField[label="Name"]').html()).not.toContain('null')
  })
})

describe('ParticipantShowView with no name', () => {
  let component
  it('does not render when not present', () => {
    const participant = Immutable.fromJS({
      id: '200',
      first_name: null,
      last_name: null,
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
    })
    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
    expect(component.find('.card-header').html()).toContain('Unknown Person')
  })
})

describe('ParticipantShowView with addresses', () => {
  let component
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: '5',
      addresses: [{
        id: '1',
        street_address: '671 Lincoln Avenue',
        city: 'Winnetka',
        state: 'IL',
        zip: '60093',
        type: 'Placement',
      }],
    })
    component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}}/>)
  })
  it('renders participant with address', () => {
    expect(component.find('ShowField[label="Address"]').html())
      .toContain('671 Lincoln Avenue')
    expect(component.find('ShowField[label="City"]').html())
      .toContain('Winnetka')
    expect(component.find('ShowField[label="State"]').html())
      .toContain('Illinois')
    expect(component.find('ShowField[label="Zip"]').html())
      .toContain('60093')
    expect(component.find('ShowField[label="Address Type"]').html())
      .toContain('Placement')
  })
})

describe('ParticipantShowView with phone numbers', () => {
  const participant = Immutable.fromJS({
    id: '7',
    phone_numbers: [{
      id: '3',
      number: '789-456-1235',
      type: 'Work',
    }],
  })
  const component = shallow(<ParticipantShowView participant={participant} onEdit={() => {}} />)
  it('renders the participant with phone numbers', () => {
    expect(component.find('ShowField[label="Phone Number"]').html())
      .toContain('789-456-1235')
    expect(component.find('ShowField[label="Phone Number Type"]').html())
      .toContain('Work')
  })
})
