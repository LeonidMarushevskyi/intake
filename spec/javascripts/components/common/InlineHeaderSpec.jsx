import InlineHeader from 'common/InlineHeader'
import React from 'react'
import {shallow} from 'enzyme'

describe('InlineHeader', () => {
  const renderInlineHeader = ({...props}) => (
    shallow(<InlineHeader {...props} />)
  )

  it('displays the header with heading text', () => {
    const component = renderInlineHeader({heading: 'Important heading'})
    expect(component.find('div div legend').text()).toEqual('Important heading')
  })
})
