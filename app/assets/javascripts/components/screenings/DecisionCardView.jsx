import Immutable from 'immutable'
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

    this.fields = Immutable.fromJS(['response_time', 'screening_decision', 'decision_rationale'])
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
  mode: React.PropTypes.string,
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}
