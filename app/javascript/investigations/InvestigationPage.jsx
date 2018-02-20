import React from 'react'
import PropTypes from 'prop-types'
import ScreeningSummaryContainer from 'investigations/ScreeningSummaryContainer'
import ContactLogContainer from 'investigations/ContactLogContainer'
import AllegationShowContainer from 'containers/investigations/AllegationShowContainer'
import HistoryOfInvolvementContainer from 'investigations/HistoryOfInvolvementContainer'
import RelationshipsCardContainer from 'investigations/RelationshipsCardContainer'
import HistoryTableContainer from 'investigations/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import CardContainer from 'containers/investigations/CardContainer'
import PageHeader from 'common/PageHeader'

class InvestigationPage extends React.Component {
  componentDidMount() {
    const {actions: {fetch}, id} = this.props
    fetch({id})
  }

  render() {
    const {id, pageTitle} = this.props
    return (
      <div>
        <div>
          <PageHeader pageTitle={pageTitle} button={null} />
        </div>
        <div className='container'>
          <ScreeningSummaryContainer />
          <CardContainer
            title='Allegations'
            id='allegations-card'
            show={<AllegationShowContainer />}
          />
          <RelationshipsCardContainer />
          <HistoryOfInvolvementContainer
            empty={<EmptyHistory />}
            notEmpty={<HistoryTableContainer />}
          />
          <ContactLogContainer id={id}/>
        </div>
      </div>
    )
  }
}

InvestigationPage.propTypes = {
  actions: PropTypes.object,
  id: PropTypes.string,
  pageTitle: PropTypes.string,
}

export default InvestigationPage
