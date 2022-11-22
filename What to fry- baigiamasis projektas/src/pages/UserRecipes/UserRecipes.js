import React from 'react'
import { useHttpClient } from '../../components/Hooks/HttpHook'
import RecipesList from '../../components/RecipesList/RecipesList'
import {  useParams } from 'react-router-dom'
import {  useNavigate} from 'react-router-dom'


import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../../components/UIElements/LoadingSpinner'


const UserRecipes = () => {

  const navigate = useNavigate()


  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const [loadedRecipes, setLoadedRecipes] = React.useState()


  const userId = useParams().userId

React.useEffect(()=> {
  const recipes = async()=> {
    try {
      const data = await sendRequest(`http://localhost:5000/api/recipes/user/${userId}`)
      setLoadedRecipes(data.recipes)
    } catch(err) {}
  }
  recipes()
}, [sendRequest, userId])

const recipeDeletedHandler = deletedRecipeId => {
  setLoadedRecipes(prevRecipe =>
    prevRecipe.filter(recipe => recipe.id !== deletedRecipeId)
  )
}

const clearErrAndNavigateHandler = () => {
  clearError()
  navigate('/')
}

  return (

    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrAndNavigateHandler} header='UPSY DAISY'/>

      {isLoading && (
        <div className='center'> 
          <LoadingSpinner /> 
        </div>
      )}

      { !isLoading && loadedRecipes && (
        <RecipesList items={loadedRecipes} onDeleteRecipe={recipeDeletedHandler} />
      )}
    </React.Fragment>
  )
}

export default UserRecipes