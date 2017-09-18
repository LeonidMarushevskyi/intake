import PropTypes from 'prop-types'
import React from 'react'

export class PageError extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.toggleOpen = this.toggleOpen.bind(this)
  }

  componentWillMount() {
    this.setState({expanded: false})
  }

  toggleOpen() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const messages = this.props.messageObject
    const problemMessage = 'There was a problem with your request and the server returned an error.'
    const instructions = 'Please save the output below and include it with any support requests.'
    const openClass = this.state.expanded ? 'expanded' : 'collapsed'
    const buttonText = this.state.expanded ? 'Collapse' : 'Expand'
    return (
      <div className={`page-error ${openClass}`}>
        <div className='container'>
          <div className='row padded'>
            <p className='no-gap'>{problemMessage} {instructions}</p>
            <button onClick={this.toggleOpen}>{buttonText}</button>
            {
              Object.keys(messages).map((key) => <p className='no-gap no-gap-bottom' key={key}><strong>{key}:</strong> <span>{messages[key]}</span></p>)
            }
          </div>
        </div>
      </div>
    )
  }
}

PageError.propTypes = {
  messageObject: PropTypes.object.isRequired,
}

export default PageError
