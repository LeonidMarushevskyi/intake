import React from 'react'
import {shallow} from 'enzyme'
import RaceForm from 'views/people/RaceForm'

describe('Race', () => {
  function renderRaceForm({
    onChange,
    personId,
    raceDetailOptions = {},
    races,
    racesDisabled = false,
  }) {
    const props = {
      onChange,
      racesDisabled, personId, raceDetailOptions,
      races: {
        White: false,
        'Black or African American': false,
        Asian: false,
        'American Indian or Alaska Native': false,
        'Native Hawaiian or Other Pacific Islander': false,
        Unknown: false,
        Abandoned: false,
        'Declined to answer': false,
        ...races,
      },
    }
    return shallow(<RaceForm {...props}/>)
  }

  it('it disables the race fields, except "Unknown" if it is checked', () => {
    const component = renderRaceForm({
      racesDisabled: true,
      races: {Unknown: true},
    })
    expect(component.find('RaceField[race="White"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Black or African American"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Asian"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="American Indian or Alaska Native"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Native Hawaiian or Other Pacific Islander"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Unknown"]').props().disabled).toEqual(false)
    expect(component.find('RaceField[race="Abandoned"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Declined to answer"]').props().disabled).toEqual(true)
  })
  it('it disables the race fields, except "Abandoned" if it is checked', () => {
    const component = renderRaceForm({
      racesDisabled: true,
      races: {Abandoned: true},
    })
    expect(component.find('RaceField[race="White"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Black or African American"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Asian"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="American Indian or Alaska Native"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Native Hawaiian or Other Pacific Islander"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Unknown"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Abandoned"]').props().disabled).toEqual(false)
    expect(component.find('RaceField[race="Declined to answer"]').props().disabled).toEqual(true)
  })
  it('it disables the race fields, except "Declined to answer" if it is checked', () => {
    const component = renderRaceForm({
      racesDisabled: true,
      races: {'Declined to answer': true},
    })
    expect(component.find('RaceField[race="White"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Black or African American"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Asian"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="American Indian or Alaska Native"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Native Hawaiian or Other Pacific Islander"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Unknown"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Abandoned"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Declined to answer"]').props().disabled).toEqual(false)
  })

  it('renders the white race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetailOptions = {
      White: [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetailOptions})
      .find('RaceField[race="White"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().raceDetailOptions).toEqual([
      {label: 'Race Detail 1', value: 'race_detail_1'},
      {label: 'Race Detail 2', value: 'race_detail_2'},
    ])
    expect(component.props().checked).toEqual(false)
  })

  it('renders the white race field as checked', () => {
    const component = renderRaceForm({
      races: {White: true},
    }).find('RaceField[race="White"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the african american race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetailOptions = {
      'Black or African American': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetailOptions})
      .find('RaceField[race="Black or African American"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().raceDetailOptions).toEqual([
      {label: 'Race Detail 1', value: 'race_detail_1'},
      {label: 'Race Detail 2', value: 'race_detail_2'},
    ])
    expect(component.props().checked).toEqual(false)
  })

  it('renders the african american field as checked', () => {
    const component = renderRaceForm({
      races: {'Black or African American': true},
    }).find('RaceField[race="Black or African American"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the asian race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetailOptions = {
      Asian: [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetailOptions})
      .find('RaceField[race="Asian"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().raceDetailOptions).toEqual([
      {label: 'Race Detail 1', value: 'race_detail_1'},
      {label: 'Race Detail 2', value: 'race_detail_2'},
    ])
    expect(component.props().checked).toEqual(false)
  })

  it('renders the asian field as checked', () => {
    const component = renderRaceForm({
      races: {Asian: true},
    }).find('RaceField[race="Asian"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the American Indian or Alaska Native race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetailOptions = {
      'American Indian or Alaska Native': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetailOptions})
      .find('RaceField[race="American Indian or Alaska Native"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().raceDetailOptions).toEqual([
      {label: 'Race Detail 1', value: 'race_detail_1'},
      {label: 'Race Detail 2', value: 'race_detail_2'},
    ])
    expect(component.props().checked).toEqual(false)
  })

  it('renders the American Indian or Alaska Native field as checked', () => {
    const component = renderRaceForm({
      races: {'American Indian or Alaska Native': true},
    }).find('RaceField[race="American Indian or Alaska Native"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the Native Hawaiian or Other Pacific Islander race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetailOptions = {
      'Native Hawaiian or Other Pacific Islander': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetailOptions})
      .find('RaceField[race="Native Hawaiian or Other Pacific Islander"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().raceDetailOptions).toEqual([
      {label: 'Race Detail 1', value: 'race_detail_1'},
      {label: 'Race Detail 2', value: 'race_detail_2'},
    ])
    expect(component.props().checked).toEqual(false)
  })

  it('renders the Native Hawaiian or Other Pacific Islander field as checked', () => {
    const component = renderRaceForm({
      races: {'Native Hawaiian or Other Pacific Islander': true},
    }).find('RaceField[race="Native Hawaiian or Other Pacific Islander"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the unknown race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderRaceForm({onChange, personId: 'person-123'})
      .find('RaceField[race="Unknown"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().checked).toEqual(false)
  })

  it('renders the unknown field as checked', () => {
    const component = renderRaceForm({
      races: {Unknown: true},
    }).find('RaceField[race="Unknown"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the abandoned race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderRaceForm({onChange, personId: 'person-123'})
      .find('RaceField[race="Abandoned"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().checked).toEqual(false)
  })

  it('renders the abandoned field as checked', () => {
    const component = renderRaceForm({
      races: {Abandoned: true},
    }).find('RaceField[race="Abandoned"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the decline to answer race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderRaceForm({onChange, personId: 'person-123'})
      .find('RaceField[race="Declined to answer"]')
    expect(component.exists()).toEqual(true)
    expect(component.props().onChange).toEqual(onChange)
    expect(component.props().personId).toEqual('person-123')
    expect(component.props().checked).toEqual(false)
  })

  it('renders the Declined to answer field as checked', () => {
    const component = renderRaceForm({
      races: {'Declined to answer': true},
    }).find('RaceField[race="Declined to answer"]')
    expect(component.props().checked).toEqual(true)
  })
})
