import PropTypes from 'prop-types'
import React from 'react'
import AllegationsShowContainer from 'containers/screenings/AllegationsShowContainer'
import AllegationsFormContainer from 'containers/screenings/AllegationsFormContainer'

export default class AllegationsCardView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {mode: props.mode}
    this.toggleMode = this.toggleMode.bind(this)
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  render() {
    const {mode} = this.state
    const AllegationsView = (mode === 'show') ? AllegationsShowContainer : AllegationsFormContainer
    return (<AllegationsView toggleMode={this.toggleMode} />)
  }
}

AllegationsCardView.propTypes = {
  mode: PropTypes.string.isRequired,
}
