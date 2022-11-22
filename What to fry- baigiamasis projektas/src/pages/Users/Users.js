import React, {useEffect, useState} from 'react'
import UsersList from '../../components/UsersList/UsersList'
import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../../components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../components/Hooks/HttpHook'


const User = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedUsers, setLoadedUsers] = useState()
  
    useEffect(() => {
      const users = async () => {
        try {
          const data = await sendRequest(
            'http://localhost:5000/api/users'
          )
  
          setLoadedUsers(data.users)
        } catch (err) {}
      }
      users()
    }, [sendRequest])
  
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} header='AN ERROR OCCURRED' />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </React.Fragment>
    )
}

export default User