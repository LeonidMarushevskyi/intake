import RaceField from 'views/people/RaceField'
import React from 'react'
import {shallow} from 'enzyme'

describe('RaceField', () => {
  function renderRaceField({
    personId,
    checked = false,
    disabled = false,
    race = 'Native Alien',
    raceDetail,
    raceDetailOptions = [],
    onRaceChange,
    onRaceDetailChange,
  }) {
    const props = {
      personId,
      checked,
      disabled,
      race,
      raceDetail,
      raceDetailOptions,
      onRaceChange,
      onRaceDetailChange,
    }
    return shallow(<RaceField {...props} />)
  }

  it('renders the checkbox', () => {
    const race = 'Black or African'
    const component = renderRaceField({personId: '123', race, checked: true, disabled: true})
    const checkbox = component.find('CheckboxField[id="participant-123-race-Black_or_African"]')
    expect(checkbox.exists()).toEqual(true)
    expect(checkbox.props().checked).toEqual(true)
    expect(checkbox.props().disabled).toEqual(true)
    expect(checkbox.props().value).toEqual(race)
    expect(checkbox.props().label).toEqual(race)
  })

  it('fires on race change when race checkbox is changed', () => {
    const onRaceChange = jasmine.createSpy('onRaceChange')
    const race = 'Black or African'
    const component = renderRaceField({personId: '123', race, onRaceChange})
    component.find('CheckboxField[id="participant-123-race-Black_or_African"]')
      .simulate('change', {target: {checked: true}})
    expect(onRaceChange).toHaveBeenCalledWith(race, true)
  })

  it('renders the select field for race detail when race is checked', () => {
    const raceDetail = 'Ethopian'
    const race = 'Black or African'
    const component = renderRaceField({personId: '123', race, raceDetail, raceDetailOptions: ['European'], checked: true})
    const select = component.find('SelectField[id="participant-123-Black_or_African-race-detail"]')
    expect(select.exists()).toEqual(true)
    expect(select.props().label).toEqual('')
    expect(select.props().value).toEqual(raceDetail)
  })

  it('does not render select field for race detail when race is unchecked', () => {
    const component = renderRaceField({checked: false})
    expect(component.find('SelectField').exists()).toEqual(false)
  })

  it('fires on race deatil change when race detail select is changed', () => {
    const onRaceDetailChange = jasmine.createSpy('onRaceDetailChange')
    const race = 'Black or African'
    const raceDetail = 'Ethopian'
    const component = renderRaceField({
      onRaceDetailChange,
      personId: '123',
      checked: true,
      race,
      raceDetailOptions: ['European'],
    })
    component.find('SelectField')
      .simulate('change', {target: {value: raceDetail}})
    expect(onRaceDetailChange).toHaveBeenCalledWith(race, raceDetail)
  })

  it('renders the race detail options', () => {
    const field = renderRaceField({
      checked: true,
      raceDetailOptions: [
        {value: '1'},
        {value: '2'},
        {value: '3'},
      ],
    }).find('SelectField')
    expect(field.childAt(0).props().value).toEqual('')
    expect(field.childAt(1).props().value).toEqual('1')
    expect(field.childAt(2).props().value).toEqual('2')
    expect(field.childAt(3).props().value).toEqual('3')
  })

  it('does not render the race detail select when no options', () => {
    const field = renderRaceField({
      checked: true,
      raceDetailOptions: [],
    }).find('SelectField')
    expect(field.exists()).toEqual(false)
  })
})
