import React from 'react'
import {shallow} from 'enzyme'
import RelationshipsCard from 'screenings/RelationshipsCard'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsContainer from 'screenings/RelationshipsContainer'

describe('RelationshipsCard', () => {
  const renderRelationshipsCard = (props) => (
    shallow(<RelationshipsCard {...props}/>, {disableLifecycleMethods: true})
  )

  it('renders an empty relationships component when there are no relationships', () => {
    const component = renderRelationshipsCard({areRelationshipsEmpty: true})
    expect(component.find('CardView').props().show).toEqual(<EmptyRelationships />)
  })

  it('renders a relationships container when there are relationships', () => {
    const component = renderRelationshipsCard({areRelationshipsEmpty: false})
    expect(component.find('CardView').props().show).toEqual(<RelationshipsContainer />)
  })
})
