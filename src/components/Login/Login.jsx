import React, { useState } from 'react'

import { auth, db, provider } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { useCollection } from 'react-firebase-hooks/firestore';
import { docUserId, saveUserInfo, setUserProfileUid } from '../../features/appSlice';
import SignIn from './SignIn';
import Register from './Register';
function LogIn(props){
    
    const [isSignIn, setIsSignIn] = useState(true);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const [users, usersLoading] = useCollection(db.collection('users'));
    const user = useAuthState(auth);

    
    function onSignIn(){
        setIsSignIn(false)
    }

    function onRegister(){
        setIsSignIn(true)
    }

    function onPassWordChange(e){
        setPassword(e.target.value)
    }

    function onConfirmChange(e){
        setConfirm(e.target.value)
    }

    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithPopup(provider).then(user => console.log(user.data())).catch((error) => 
        alert(error.message));
    }
    const handleRegister = (e) => {
        e.preventDefault();
        password !== confirm ? alert("You type different confirm password!"):
        auth.createUserWithEmailAndPassword(email, password).then(
            (userCred) => {
                console.log(userCred.user)
                const userInf={
                    displayName: userCred.user.displayName,
                    email: userCred.user.email,
                    emailVerified: userCred.user.emailVerified,
                    uid: userCred.user.uid,
                    photoURL: userCred.user.photoURL,
                    isOnline: true
                }
    
                dispatch(saveUserInfo({user: userInf}));
                db.collection('users').add(userInf).then(doc => dispatch(docUserId({
                    docUserId: doc.id
                })))
            }
                
        )
        .catch(err => alert(err.message))
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then( async (userCred) => {
            const userInf={
                displayName: userCred.user.displayName,
                email: userCred.user.email,
                emailVerified: userCred.user.emailVerified,
                uid: userCred.user.uid,
                photoURL: userCred.user.photoURL,
                isOnline: true
            }

            let userDb ;
            if(!usersLoading&&users){
            userDb = users?.docs.find(elem => elem.data().uid === userInf.uid);
            dispatch(saveUserInfo({user: userDb?.data()}));
            dispatch(docUserId({
                docUserId: userDb?.id
            }))
            }
            
        }
        )
        .catch(err => alert(err.message))
    }

    const onEmailChange = (e) =>{
        setEmail(e.target.value)
    }




    if(isSignIn) return <SignIn
    onClick = {onSignIn} signIn = {signIn}
    password = {password}
    email = {email}
    onPassWordChange = {onPassWordChange}
    onEmailChange = {onEmailChange}
    signInEmail = {handleSignIn}

    />

    else return <Register onClick = {onRegister}
        password = {password}
        confirm ={confirm}
        email = {email}
        onPassWordChange = {onPassWordChange}
        onConfirmChange = {onConfirmChange}
        onEmailChange = {onEmailChange}
        register = {handleRegister}


    />

}

export default LogIn;



