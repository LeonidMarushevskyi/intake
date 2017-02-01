import AgeInfo from 'components/common/AgeInfo'
import React from 'react'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('age', () => {
  it('renders when DOB is present', () => {
    const dob = moment().subtract(15, 'years').format('YYYY-MM-DD')
    const props = {dateOfBirth: dob}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).toContain('15 yrs old')
  })

  it('does not render when DOB is not present', () => {
    const props = {dateOfBirth: null}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).not.toContain('yrs old')
  })
})
