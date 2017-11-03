import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import WorkerSafetyShowContainer from 'screenings/workerSafety/WorkerSafetyShowContainer'

export default class WorkerSafetyCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.toggleMode = this.toggleMode.bind(this)
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  render() {
    const {mode} = this.state
    return (
      <div className={`card ${mode} double-gap-top`} id='worker-safety-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Worker Safety'
          showEdit={this.props.editable && mode === 'show'}
        />
        {mode === 'show' && <WorkerSafetyShowContainer />}
      </div>
    )
  }
}

WorkerSafetyCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['show', 'edit']),
}
