import DecisionShowContainer from 'containers/screenings/DecisionShowContainer'
import DecisionFormContainer from 'containers/screenings/DecisionFormContainer'
import PropTypes from 'prop-types'
import React from 'react'

export default class DecisionCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {mode: this.props.mode}
    this.toggleMode = this.toggleMode.bind(this)
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  render() {
    const {mode} = this.state
    const DecisionView = (mode === 'edit') ? DecisionFormContainer : DecisionShowContainer
    return (<DecisionView toggleMode={this.toggleMode} />)
  }
}

DecisionCardView.propTypes = {
  mode: PropTypes.string,
}
