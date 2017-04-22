import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import DecisionEditView from 'components/screenings/DecisionEditView'
import DecisionShowView from 'components/screenings/DecisionShowView'

export default class DecisionCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)

    this.fields = Immutable.fromJS(['screening_decision_detail', 'screening_decision', 'additional_information'])
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  onCancel() {
    this.setState({mode: 'show'})
    this.props.onCancel(this.fields)
  }

  onSave() {
    return this.props.onSave(this.fields).then(() => {
      this.setState({mode: 'show'})
    })
  }

  render() {
    const {mode} = this.state
    const allProps = {
      edit: {
        onCancel: this.onCancel,
        onChange: this.props.onChange,
        onSave: this.onSave,
        screening: this.props.screening,
      },
      show: {
        onEdit: this.onEdit,
        screening: this.props.screening,
      },
    }
    const DecisionView = (mode === 'edit') ? DecisionEditView : DecisionShowView
    const props = allProps[mode]
    return <DecisionView {...props} />
  }
}

DecisionCardView.propTypes = {
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
