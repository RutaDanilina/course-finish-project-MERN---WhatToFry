import React from 'react'
import { Link } from 'react-router-dom'

import Avatar from '../../components/UIElements/Avatar'
import Card from '../../components/UIElements/Card'
import './UserItem.scss'

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/recipes`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.recipeCount} {props.recipeCount === 1 ? 'Recipe' : 'Recipes'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem