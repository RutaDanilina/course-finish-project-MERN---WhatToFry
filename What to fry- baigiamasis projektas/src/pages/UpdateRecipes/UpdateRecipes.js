import React, {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import {  useNavigate} from 'react-router-dom';
import { AuthContext } from '../../components/Context/AuthContext';


import '../NewRecipe/NewRecipe.scss'

import {useHttpClient} from '../../components/Hooks/HttpHook'
import { useForm } from '../../components/Hooks/FormHook'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../components/Util/validators'

import Input from '../../components/FormElements/Input'
import Btn from '../../components/FormElements/Btn'
import Card from '../../components/UIElements/Card'
import LoadingSpinner from '../../components/UIElements/LoadingSpinner'
import ErrorModal from '../../components/Modal/ErrorModal'



const UpdateRecipes = () => {
  const {userId, token} = useContext(AuthContext)

  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedRecipe, setLoadedRecipe] = useState()

  const recipeId = useParams().recipeId
  const navigate = useNavigate()

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  )

  useEffect(() => {
    const recipe = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/recipes/${recipeId}`
        );
        setLoadedRecipe(data.recipe);
        setFormData(
          {
            title: {
              value: data.recipe.title,
              isValid: true
            },
            description: {
              value: data.recipe.description,
              isValid: true
            }
          },
          true
        )
      } catch (err) {}
    }
    recipe()
  }, [sendRequest, recipeId, setFormData])


  const recipeUpdateSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      await sendRequest(
        `http://localhost:5000/api/recipes/${recipeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      )
      navigate('/' + userId + '/recipes');
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedRecipe && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find recipe!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} header='AN ERROR OCCURRED' />
      {!isLoading && loadedRecipe && (
        <form className="recipe-form" onSubmit={recipeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedRecipe.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedRecipe.description}
            initialValid={true}
          />
          <Btn type="submit" disabled={!formState.isValid}>
            UPDATE RECIPE
          </Btn>
        </form>
      )}
    </React.Fragment>
  )
}

export default UpdateRecipes