import React from 'react'
import {shallow} from 'enzyme'
import RelationshipsCard from 'investigations/RelationshipsCard'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsContainer from 'investigations/RelationshipsContainer'

describe('RelationshipsCard', () => {
  const renderRelationshipsCard = (props) => (
    shallow(<RelationshipsCard {...props}/>, {disableLifecycleMethods: true})
  )

  describe('EmptyRelationships', () => {
    it('renders an empty relationships component', () => {
      const component = renderRelationshipsCard({areRelationshipsEmpty: true})
      expect(component.find(EmptyRelationships).exists()).toEqual(true)
    })
  })

  it('renders a relationships component when there are relationships', () => {
    const component = renderRelationshipsCard({areRelationshipsEmpty: false})
    expect(component.find(RelationshipsContainer).exists()).toEqual(true)
  })
})
