import React from 'react'

function Register(props){
    return(
        <div className="login">
            <div className="col-md-6 img-bg-container">

            </div>

            <div className="col-md-6 form-container">
            
                <span className="form__title">
                    Register
                </span>
                <form method="post">
                    <div className="form__input">
                        
                            
                            <input name="form__email" type="text" className="input-area" value = {props.email} onChange={(e) => props.onEmailChange(e)} required/>
                            <span className="label-span">Email</span>
                    
                    </div>
                    <div className="form__input">
                       
                            
                            <input name="form__password" type="password" className="input-area" value = {props.password}  onChange={(e) => props.onPassWordChange(e)} required/>
                            <span className='label-span'>Password</span>
                      
                    </div>

                    <div className="form__input">
                       
                            
                            <input name="form__password" type="password" className="input-area" value = {props.confirm} onChange={(e) => props.onConfirmChange(e)} required/>
                            <span className='label-span'>Confirm Password</span>
                      
                    </div>

                    <button type="submit" onClick = {props.register}  className="form__button">Sign in</button>
                </form>

                <div className="change-form">
                    <p><span onClick={props.onClick}>Login</span> if you already have an account</p>
                </div>
            </div>
            
        </div>
    )
}

export default Register
