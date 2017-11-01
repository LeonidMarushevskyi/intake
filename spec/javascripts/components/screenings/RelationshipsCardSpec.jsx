import React from 'react'
import {shallow} from 'enzyme'
import RelationshipsCard from 'screenings/RelationshipsCard'
import {EmptyRelationships} from 'investigations/Relationships'
import RelationshipsContainer from 'screenings/RelationshipsContainer'

describe('RelationshipsCard', () => {
  const renderRelationshipsCard = (props) => (
    shallow(<RelationshipsCard {...props}/>)
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
