import NarrativeFormContainer from 'screenings/narrative/NarrativeFormContainer'
import NarrativeShowContainer from 'screenings/narrative/NarrativeShowContainer'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

export default class NarrativeCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.toggleShow = this.toggleShow.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.state = {
      mode: this.props.mode,
    }
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  toggleShow() {
    this.setState({mode: 'show'})
  }

  render() {
    const {mode} = this.state
    return (
      <div className={`card ${mode} double-gap-top`} id='narrative-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Narrative'
          showEdit={this.props.editable && mode === 'show'}
        />
        {mode === 'edit' && <NarrativeFormContainer toggleShow={this.toggleShow} />}
        {mode === 'show' && <NarrativeShowContainer />}
      </div>
    )
  }
}

NarrativeCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
}
