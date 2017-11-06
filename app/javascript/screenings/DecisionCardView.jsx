import DecisionEditView from 'screenings/DecisionEditView'
import DecisionShowContainer from 'containers/screenings/DecisionShowContainer'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'

export default class DecisionCardView extends React.Component {
  constructor(props) {
    super(props)

    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.fields = Immutable.fromJS([
      'screening_decision_detail',
      'screening_decision',
      'additional_information',
      'access_restrictions',
      'restrictions_rationale',
    ])

    let displayErrorsFor
    if (this.props.mode === 'show') {
      displayErrorsFor = this.fields
    } else {
      displayErrorsFor = Immutable.List()
    }

    this.state = {
      mode: this.props.mode,
      displayErrorsFor: displayErrorsFor,
    }
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show', displayErrorsFor: this.fields})
    })
  }

  onBlur(fieldName) {
    const displayErrorsFor = this.state.displayErrorsFor.push(fieldName)
    this.setState({displayErrorsFor: displayErrorsFor})
  }

  filteredErrors() {
    return this.props.errors.filter((_value, key) => (
      this.state.displayErrorsFor.includes(key)
    )).toJS()
  }

  render() {
    const {mode} = this.state
    const errors = this.filteredErrors()
    const allProps = {
      edit: {
        errors: errors,
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
        onBlur: this.onBlur,
      },
      show: {
        errors: errors,
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const DecisionView = (mode === 'edit') ? DecisionEditView : DecisionShowContainer
    const props = allProps[mode]
    return (<DecisionView {...props} />)
  }
}

DecisionCardView.propTypes = {
  editable: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
