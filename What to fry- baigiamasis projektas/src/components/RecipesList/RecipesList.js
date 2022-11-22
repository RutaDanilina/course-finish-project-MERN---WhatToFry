import React from 'react'
import './RecipesList.scss'
import Card from '../UIElements/Card'
import Btn from '../FormElements/Btn'
import RecipeItem from '../RecipeItem/RecipeItem'



const RecipesList = (props) => {
    if(props.items.length === 0) {
      return (
        <div className='recipe-list center'>
          <Card>
            <h2>No Recipes Found</h2>
            <Btn to='/recipes/new'>Add Recipe</Btn>
          </Card>
        </div>
      )
    }

    return (
      <ul className='recipe-list'>
          {props.items.map(recipe => {
            return (
              <RecipeItem 
                key={recipe.id}
                id={recipe.id}
                image={recipe.image}
                title={recipe.title}
                description={recipe.description}
                address={recipe.address}
                creatorId={recipe.creator}
                onDelete={props.onDeleteRecipe}
              />
              )
          })}
      </ul>
    )
}

export default RecipesList