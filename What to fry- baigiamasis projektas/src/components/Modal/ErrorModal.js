import React from 'react'
import Btn from '../FormElements/Btn'
import Modal from './Modal';

const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header={props.header}
      show={!!props.error}
      footer={<Btn onClick={props.onClear}>Okay</Btn>}
    >
      <p>{props.error}</p>
    </Modal>
  )
}

export default ErrorModal
