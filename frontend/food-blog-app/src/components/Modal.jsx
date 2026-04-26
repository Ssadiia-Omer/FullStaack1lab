import PropTypes from 'prop-types'

export default function Modal({children, onClose}) {
  return (
    <>
        <div className='backdrop' onClick={onClose}></div>
        <div className='modal'>
            <button className='modal-close' onClick={onClose}>×</button>
            {children}
        </div>
    </>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}
