import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import WorkerSafetyShowContainer from 'containers/screenings/WorkerSafetyShowContainer'
import WorkerSafetyFormContainer from 'containers/screenings/WorkerSafetyFormContainer'

export default class WorkerSafetyCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.toggleMode = this.toggleMode.bind(this)
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  render() {
    const {mode} = this.state
    return (
      <div className={`card ${mode} double-gap-top`} id='worker-safety-card'>
        <ScreeningCardHeader
          onEdit={this.toggleMode}
          title='Worker Safety'
          showEdit={this.props.editable && mode === 'show'}
        />
        {mode === 'edit' && <WorkerSafetyFormContainer toggleMode={this.toggleMode} />}
        {mode === 'show' && <WorkerSafetyShowContainer />}
      </div>
    )
  }
}

WorkerSafetyCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['show', 'edit']),
}
