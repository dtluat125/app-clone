import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import '../css/loading.css'
import { auth } from '../firebase';
function Loading() {
    const [user, loading] = useAuthState(auth)
    const [isAnimate, setIsAnimate] = useState(false)
    useEffect(() => {
        animate();
        return () => {
            
        }
    }, [loading])

    function animate(){
        setTimeout(() => {
            setIsAnimate(!isAnimate);
           
        },1000)
    }
    

    animate()
    
    return (
        <div className="loading-container">
            <div className="loading__content">
                <h1>Loading</h1>
                <div className="dots">
                    <div className={isAnimate?"dot z animate":"dot z"} ></div>
                    <div className={isAnimate?"dot f animate":"dot f"}></div>
                    <div className={isAnimate?"dot s animate":"dot s"}></div>
                    <div className={isAnimate?"dot t animate":"dot t"}></div>
                    <div className={isAnimate?"dot l animate":"dot l"}></div>
                </div>
            </div>
        <script></script>
        </div>
    )
}

export default Loading
