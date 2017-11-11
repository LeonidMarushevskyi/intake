import React from 'react'
import {shallow} from 'enzyme'
import RaceForm from 'views/people/RaceForm'

describe('Race', () => {
  function renderRaceForm({
    onChange,
    personId,
    raceDetails = {},
    races,
    racesDisabled = false,
  }) {
    const props = {
      onChange,
      racesDisabled, personId, raceDetails,
      races: {
        White: {
          checked: false,
          detail: '',
        },
        'Black or African American': {
          checked: false,
          detail: '',
        },
        Asian: {
          checked: false,
          detail: '',
        },
        'American Indian or Alaska Native': {
          checked: false,
          detail: '',
        },
        'Native Hawaiian or Other Pacific Islander': {
          checked: false,
          detail: '',
        },
        Unknown: {
          checked: false,
        },
        Abandoned: {
          checked: false,
        },
        'Declined to answer': {
          checked: false,
        },
        ...races,
      },
    }
    return shallow(<RaceForm {...props}/>)
  }

  it('it disables the race fields, except the one that was checked', () => {
    const component = renderRaceForm({
      racesDisabled: true,
      races: {White: {checked: true}},
    })
    expect(component.find('RaceField[race="White"]').props().disabled).toEqual(false)
    expect(component.find('RaceField[race="Black or African American"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Asian"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="American Indian or Alaska Native"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Native Hawaiian or Other Pacific Islander"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Unknown"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Abandoned"]').props().disabled).toEqual(true)
    expect(component.find('RaceField[race="Declined to answer"]').props().disabled).toEqual(true)
  })

  it('renders the white race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetails = {
      White: [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetails})
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
      races: {White: {checked: true}},
    }).find('RaceField[race="White"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the african american race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetails = {
      'Black or African American': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetails})
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
      races: {'Black or African American': {checked: true}},
    }).find('RaceField[race="Black or African American"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the asian race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetails = {
      Asian: [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetails})
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
      races: {Asian: {checked: true}},
    }).find('RaceField[race="Asian"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the American Indian or Alaska Native race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetails = {
      'American Indian or Alaska Native': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetails})
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
      races: {'American Indian or Alaska Native': {checked: true}},
    }).find('RaceField[race="American Indian or Alaska Native"]')
    expect(component.props().checked).toEqual(true)
  })

  it('renders the Native Hawaiian or Other Pacific Islander race field', () => {
    const onChange = jasmine.createSpy('onChange')
    const raceDetails = {
      'Native Hawaiian or Other Pacific Islander': [
        {label: 'Race Detail 1', value: 'race_detail_1'},
        {label: 'Race Detail 2', value: 'race_detail_2'},
      ],
    }
    const component = renderRaceForm({onChange, personId: 'person-123', raceDetails})
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
      races: {'Native Hawaiian or Other Pacific Islander': {checked: true}},
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
      races: {Unknown: {checked: true}},
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
      races: {Abandoned: {checked: true}},
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
      races: {'Declined to answer': {checked: true}},
    }).find('RaceField[race="Declined to answer"]')
    expect(component.props().checked).toEqual(true)
  })
})
