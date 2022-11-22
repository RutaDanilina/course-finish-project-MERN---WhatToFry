import React, {useState, useContext} from 'react'
import { useHttpClient } from '../../components/Hooks/HttpHook'
import { AuthContext } from '../../components/Context/AuthContext'
import './Auth.scss'

import ImageUpload from '../../components/FormElements/ImageUpload'
import Card from '../../components/UIElements/Card'
import Input from '../../components/FormElements/Input'
import ErrorModal from '../../components/Modal/ErrorModal'
import LoadingSpinner from '../../components/UIElements/LoadingSpinner'
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../components/Util/validators'
import { useForm} from '../../components/Hooks/FormHook'
import Btn from '../../components/FormElements/Btn'

const Auth = () => {
  const {login} = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined 
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode(prevMode => !prevMode)
  }

  const authSubmitHandler = async (e) => {
    e.preventDefault()

    if (isLoginMode) {
      try {
        const data = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        login(data.userId, data.token)
      } catch (err) {}
    } else {
      try {
        const formData = new FormData()
        formData.append('email', formState.inputs.email.value)
        formData.append('name', formState.inputs.name.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)
        const data = await sendRequest(
          'http://localhost:5000/api/users/register',
          'POST',
          formData
        );

        login(data.userId, data.token);
      } catch (err) {}
    }
  }

  return (
<React.Fragment>
      <ErrorModal error={error} onClear={clearError} header='AN ERROR OCCURRED' />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}

        <PersonAddIcon sx={{ height:'4rem', width:'4rem'}}/>

        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              placeholder="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            placeholder="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            placeholder="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          


          <Btn type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'REGISTER'}
          </Btn>
        </form>
        <Btn inverse onClick={switchModeHandler}>
          {isLoginMode ? 'REGISTER' : 'LOGIN'}
        </Btn>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
