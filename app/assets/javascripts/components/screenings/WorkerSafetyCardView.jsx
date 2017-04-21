import React from 'react'
import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'

export default class WorkerSafetyCardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
    this.onEdit = this.onEdit.bind(this)
  }

  onEdit(event) {
    event.preventDefault()
    this.setState({mode: 'edit'})
  }

  render() {
    const {mode} = this.state
    const allprops = {
      show: {
        onEdit: this.onEdit,
      },
    }
    const WorkerSafetyView = (mode === 'edit') ? WorkerSafetyShowView : WorkerSafetyShowView
    const props = allprops[mode]
    return <WorkerSafetyView {...props} />
  }
}

WorkerSafetyCardView.propTypes = {
  mode: React.PropTypes.oneOf(['show']),
}
