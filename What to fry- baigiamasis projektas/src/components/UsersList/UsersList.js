import React from 'react'
import './UsersList.scss'
import UserItem from '../UserItem/UserItem'
import Card from '../UIElements/Card'


const UsersList = (props) => {

  if(props.items.length === 0){
    return (
      <div>
        <Card>
          <h2>No Users Found</h2>
        </Card>
      </div>
    )
  }

  return(
    <ul className='users-list'>
      {props.items.map(user => {
        return (
          <UserItem 
            key={user.id} 
            id={user.id} 
            image={user.image} 
            name={user.name} 
            recipeCount={user.recipes.length} />
        )
      })}
    </ul>
  )
}

export default UsersList