import PropTypes from 'prop-types'
import React from 'react'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsContainer from 'screenings/RelationshipsContainer'
import CardView from 'views/CardView'

const RelationshipsCard = ({areRelationshipsEmpty}) => (
  <CardView
    id='relationships-card'
    title='Relationships'
    mode='show'
    show={areRelationshipsEmpty ? <EmptyRelationships /> : <RelationshipsContainer />}
  />
)

RelationshipsCard.propTypes = {
  areRelationshipsEmpty: PropTypes.bool,
}

export default RelationshipsCard
