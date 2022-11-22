import React, {useRef, useState, useEffect} from 'react'
import './ImageUpload.scss'

// import Btn from './Btn'

const ImageUpload = (props) => {

    const imgRef = useRef()
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)


    useEffect(()=> {

        if (!file) {
            return
        }

        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)

    },[file])

    const pickedHandler = (e) => {
        let pickedFile
        let fileIsValid = isValid
        if(e.target.files || e.target.files.length !== 1){
                pickedFile = e.target.files[0]
                setFile(pickedFile)
                setIsValid(true)
                fileIsValid = true
        } else {
                setIsValid(false)
                fileIsValid= false
        }

       props.onInput(props.id, pickedFile, fileIsValid)
    }

    const pickImageHandler = () => {
        imgRef.current.click()
    }

  return (
    <div className='form-control'>
        <input 
            type='file' 
            id={props.id} 
            style={{display:'none'}} 
            accept=".jpg, .png, .jpeg" 
            ref={imgRef}
            onChange={pickedHandler}
        />

        <div className={`image-upload ${props.center && 'center'}`} onClick={pickImageHandler}>
            <div className='image-upload__preview'>
                {previewUrl && <img src={previewUrl} alt='Preview' />}
                {!previewUrl && <p>Please pick a Photo</p>}
            </div>
      
        </div>

        {!isValid && <p className='error-message'>{props.errorText}</p> }

    </div>
  )
}

export default ImageUpload