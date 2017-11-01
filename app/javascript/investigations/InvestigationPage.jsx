import React from 'react'
import PropTypes from 'prop-types'
import ScreeningSummaryContainer from 'investigations/ScreeningSummaryContainer'
import ContactLogContainer from 'investigations/ContactLogContainer'
import AllegationShowContainer from 'investigations/AllegationShowContainer'
import HistoryOfInvolvementContainer from 'investigations/HistoryOfInvolvementContainer'
import RelationshipsCardContainer from 'investigations/RelationshipsCardContainer'

export class InvestigationPage extends React.Component {
  componentDidMount() {
    const {actions: {fetch}, id} = this.props
    fetch({id})
  }

  render() {
    const {id} = this.props
    return (
      <div>
        <ScreeningSummaryContainer />
        <AllegationShowContainer />
        <RelationshipsCardContainer />
        <HistoryOfInvolvementContainer />
        <ContactLogContainer id={id}/>
      </div>
    )
  }
}

InvestigationPage.propTypes = {
  actions: PropTypes.object,
  id: PropTypes.string,
}

export default InvestigationPage
