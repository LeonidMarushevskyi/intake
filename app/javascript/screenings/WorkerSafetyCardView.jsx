import PropTypes from 'prop-types'
import React from 'react'
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
        {mode === 'edit' && <WorkerSafetyFormContainer toggleMode={this.toggleMode} />}
        {
          mode === 'show' &&
            <WorkerSafetyShowContainer
              showEdit={this.props.editable}
              toggleMode={this.toggleMode}
            />
        }
      </div>
    )
  }
}

WorkerSafetyCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['show', 'edit']),
}
