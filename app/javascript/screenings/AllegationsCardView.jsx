import PropTypes from 'prop-types'
import React from 'react'
import AllegationsEditView from 'screenings/AllegationsEditView'
import AllegationsShowContainer from 'containers/screenings/AllegationsShowContainer'
import AllegationsFormContainer from 'containers/screenings/AllegationsFormContainer'
import * as AllegationsHelper from 'utils/allegationsHelper'

export default class AllegationsCardView extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      mode: props.mode,
    }

    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
    this.toggleMode = this.toggleMode.bind(this)
  }

  onCancel() {
    this.props.onCancel(['allegations'])
    this.setState({mode: 'show'})
  }

  onChange(victimId, perpetratorId, allegationTypes) {
    this.props.onChange(['allegations', victimId, perpetratorId], allegationTypes)
  }

  onSave() {
    this.props.onSave(['allegations'])
    this.setState({mode: 'show'})
  }

  toggleMode() {
    const currentMode = this.state.mode
    const newMode = currentMode === 'show' ? 'edit' : 'show'
    this.setState({mode: newMode})
  }

  alertErrorMessage() {
    if (!AllegationsHelper.siblingAtRiskHasRequiredComplementaryAllegations(this.props.allegations)) {
      return 'Any allegations of Sibling at Risk must be accompanied by another allegation.'
    } else if (this.props.required) {
      if (this.props.allegations.some((allegation) => !allegation.get('allegation_types').isEmpty())) {
        return null
      } else {
        return 'Any report that is promoted for referral must include at least one allegation.'
      }
    } else {
      return null
    }
  }

  render() {
    const {mode} = this.state
    const AllegationsView = (mode === 'show') ? AllegationsShowContainer : AllegationsFormContainer
    return (<AllegationsView toggleMode={this.toggleMode} />)
  }
}

AllegationsCardView.propTypes = {
  allegations: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
}
