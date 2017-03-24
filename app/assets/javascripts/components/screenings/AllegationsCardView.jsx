import React from 'react'
import AllegationsEditView from 'components/screenings/AllegationsEditView'
import AllegationsShowView from 'components/screenings/AllegationsShowView'

export default class AllegationsCardView extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      mode: props.mode,
    }

    this.onCancel = this.onCancel.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onCancel() {
    this.setState({mode: 'show'})
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    this.setState({mode: 'show'})
  }

  render() {
    const {mode} = this.state
    const props = {
      allegations: this.props.allegations,
      onCancel: this.onCancel,
      onEdit: this.onEdit,
      onSave: this.onSave,
    }

    const AllegationsView = (mode === 'show') ? AllegationsShowView : AllegationsEditView
    return <AllegationsView {...props} />
  }
}

AllegationsCardView.propTypes = {
  allegations: React.PropTypes.object.isRequired,
  mode: React.PropTypes.string.isRequired,
}
