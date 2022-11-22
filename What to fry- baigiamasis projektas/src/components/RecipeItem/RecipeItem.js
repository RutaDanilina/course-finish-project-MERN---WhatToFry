/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useHttpClient } from '../Hooks/HttpHook'
import {AuthContext} from '../Context/AuthContext'
import {  useNavigate} from 'react-router-dom'

import Btn from '../FormElements/Btn'
import Card from '../UIElements/Card'
import Modal from '../Modal/Modal'
import ErrorModal from '../Modal/ErrorModal'
import LoadingSpinner from '../UIElements/LoadingSpinner'

import './RecipeItem.scss'

import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeItem = (props) => {

  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const {isLoggedIn, userId, token} = React.useContext(AuthContext)

  const [showConfirmModal, setShowConfirmModal] = React.useState(false)

  const navigate = useNavigate()


  const showDeleteWarningHandler = () => {
     setShowConfirmModal(true)
  }

  const cancelDeleteWarningHandler = () => {
     setShowConfirmModal(false)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/recipes/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + token
        }
      )
      props.onDelete(props.id)
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header='Are you sure'
        footerClass='recipe-item__modal-actions'
        footer={
          <React.Fragment>
            <Btn normal onClick={cancelDeleteWarningHandler}>Cancel</Btn>
            <Btn danger onClick={confirmDeleteHandler}>DELETE</Btn>
          </React.Fragment>
        }  
      >
        <p>Do you really want to delete this recipe?</p>
      </Modal>

    <li className='recipe-item'>
      <Card className='recipe-item__content'>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className='recipe-item__image'>
          <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
        </div>

        <div className='recipe-item__info'>
          <h2> {props.title} </h2>
          <p> {props.description} </p>
        </div>

        <div className='recipe-item__actions'>
          <a href={props.address} > <RemoveRedEyeIcon /> </a> 

          {isLoggedIn && userId === props.creatorId &&  (
           <a href='#'><EditIcon onClick={()=> navigate(`/recipes/${props.id}`)} /></a>
          )}

          {isLoggedIn && userId === props.creatorId && (   
           <span><DeleteIcon  onClick={showDeleteWarningHandler}/></span>
          )}

        </div>
      </Card>
    </li>
    </React.Fragment>
  )
}

export default RecipeItem