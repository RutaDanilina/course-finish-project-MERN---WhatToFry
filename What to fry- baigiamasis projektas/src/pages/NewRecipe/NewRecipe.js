import React, { useContext } from 'react'
import { AuthContext } from '../../components/Context/AuthContext'
import { useForm } from '../../components/Hooks/FormHook'
import { useHttpClient } from '../../components/Hooks/HttpHook'
import {  useNavigate} from 'react-router-dom'
import ImageUpload from '../../components/FormElements/ImageUpload'

import Input from '../../components/FormElements/Input'
import Btn from '../../components/FormElements/Btn'
import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../../components/UIElements/LoadingSpinner'

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../components/Util/validators'

import './NewRecipe.scss'


const NewRecipe = () => {

  const {token} = useContext(AuthContext)
  const {isLoading, error, sendRequest, clearError} = useHttpClient()

  const [formState, inputHandler] = useForm({
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
  },
    false
  )

  const navigate = useNavigate()

  const recipeSubmitHandler = async(e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('image', formState.inputs.image.value)
      await sendRequest(
        'http://localhost:5000/api/recipes', 
        'POST', 
        formData, 
        {
        Authorization: 'Bearer ' + token
      })
      navigate('/')
      } catch(err) {}
  }

  return (

    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} header='AN ERROR OCCURRED' />

    <form className="recipe-form" onSubmit={recipeSubmitHandler}>
      { isLoading && <LoadingSpinner asOverlay/>}
      <Input
        id="title"
        element="input"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        placeholder='Title'
      />
      <Input
        id="description"
        element="textarea"
        placeholder="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        placeholder="Web Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <ImageUpload 
        id='image' 
        onInput={inputHandler}  
        errorText='Please add an image'
      />
      <Btn type="submit" disabled={!formState.isValid}>
        ADD RECIPE
      </Btn>
    </form>
    </React.Fragment>
  )
}

export default NewRecipe
