import React from 'react'
import { AuthContext } from './components/Context/AuthContext'
import { useAuth } from './components/Hooks/AuthHook'
import { BrowserRouter , Route,Navigate, Routes } from 'react-router-dom'

import MainNavigation from './components/Header/MainNavigation'
import NewRecipe from './pages/NewRecipe/NewRecipe'
import Users from './pages/Users/Users'
import UserRecipes from './pages/UserRecipes/UserRecipes'
import Auth from '../src/pages/Auth/Auth'
import UpdateRecipes from './pages/UpdateRecipes/UpdateRecipes'
import HomePage from './pages/HomePage/HomePage'
import BackToTop from './components/BackTopTop/BackToTop'



const App = () => {

  const { token, login, logout, userId } = useAuth()


  let routes

  if (token) {
    routes = (
      <Routes>
        <Route path="/" end element={ <Users />} />
        <Route path='/home' end element={ <HomePage />} />
        <Route path="/:userId/recipes" end element={  <UserRecipes />} />
        <Route path="/recipes/new" end element={<NewRecipe />} />
        <Route path="/recipes/:recipeId" element={  <UpdateRecipes />} />
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/" end element={ <Users />} />
        <Route path='/home' end element={ <HomePage />} />
        <Route path="/:userId/recipes" end element={ <UserRecipes />} />
        <Route path="/auth" element={ <Auth />} />
        <Route path="*" element={<Navigate to="/auth"/>}/>

      </Routes>
    )
  }

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token,
        token,  
        login, 
        logout, 
        userId 
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
      <BackToTop />
    </AuthContext.Provider>
  )
}

export default App
