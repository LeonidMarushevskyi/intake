import GenderRaceAndEthnicity from 'common/GenderRaceAndEthnicity'
import React from 'react'
import {shallow} from 'enzyme'

describe('gender,race and ethnicity', () => {
  it('renders correctly when only gender is provided', () => {
    const props = {
      gender: 'female',
      races: [],
      ethnicity: {},
    }
    const component = shallow(<GenderRaceAndEthnicity {...props} />)
    expect(component.html()).toContain('<div>Female</div>')
  })

  it('renders correctly when only races is provided', () => {
    const props = {
      races: [
        {race: 'White', race_detail: 'European'},
        {race: 'American Indian or Alaska Native'},
      ],
    }
    const component = shallow(<GenderRaceAndEthnicity {...props} />)
    expect(component.html()).toContain(
      '<div>White, American Indian or Alaska Native</div>'
    )
  })

  it('renders correctly when only ethnicity is provided', () => {
    const props = {
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: ['Central American'],
      },
    }
    const component = shallow(<GenderRaceAndEthnicity {...props} />)
    expect(component.html()).toContain(
      '<div>Hispanic/Latino</div>'
    )
  })

  it('renders correctly when gender races and ethnicity are provided', () => {
    const props = {
      gender: 'female',
      races: [
        {race: 'White', race_detail: 'European'},
        {race: 'American Indian or Alaska Native'},
      ],
      ethnicity: {hispanic_latino_origin: 'Unknown'},
    }
    const component = shallow(<GenderRaceAndEthnicity {...props} />)
    expect(component.html()).toContain(
      '<div>Female, White, American Indian or Alaska Native</div>'
    )
  })
})
