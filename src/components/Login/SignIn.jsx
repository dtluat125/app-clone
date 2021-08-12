import React from 'react'

function SignIn(props){



    return(
        <div className="login">
            <div className="col-md-6 img-bg-container">

            </div>

            <div className="col-md-6 form-container">
            
                <span className="form__title">
                    Login to continue
                </span>
                <form method="post">
                    <div className="form__input">
                        
                            
                            <input name="form__email" type="text" className="input-area" onChange={props.onEmailChange} value={props.email} required/>
                            <span className="label-span">Email</span>
                    
                    </div>
                    <div className="form__input">
                       
                            
                            <input name="form__password" type="password" className="input-area" onChange={props.onPassWordChange} value={props.password}  required/>
                            <span className='label-span'>Password</span>
                      
                    </div>

                    <button onClick={props.signInEmail} type="submit" className="form__button">Sign in</button>
                </form>
                <div className="change-form">
                    
                    <p><span onClick={props.onClick}>REGISTER</span> if you don't have any account</p>

                </div>
            </div>
            
        </div>
    )
}

export default SignIn

