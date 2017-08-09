import AddressInfo from 'common/AddressInfo'
import React from 'react'
import {shallow} from 'enzyme'

describe('address', () => {
  it('renders when present', () => {
    const props = {
      id: '1',
      streetAddress: '234 Fake Street',
      city: 'Flushing',
      state: 'NM',
      zip: '11344',
      type: 'School',
    }
    const component = shallow(<AddressInfo {...props} />)
    expect(component.html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><strong class="c-gray half-pad-right">School</strong><span>234 Fake Street, Flushing, NM 11344</span></div>')
  })

  it('gets rendered correctly when partial address is given', () => {
    const props = {
      id: '1',
      streetAddress: null,
      city: null,
      state: 'NM',
      zip: '11344',
      type: null,
    }
    const component = shallow(<AddressInfo {...props} />)
    expect(component.html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><span>NM 11344</span></div>')
  })
})

