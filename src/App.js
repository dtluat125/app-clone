import './css/main.css'
import LogIn from './components/Login/Login';
import './App.css';
import './css/login.css'
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import Chat from './components/Chat/Chat';
import {useAuthState} from "react-firebase-hooks/auth";
import { auth, db } from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {useEffect, useState } from 'react';
import Loading from './components/Loading';
import EditProfile from './components/Edit Profile/EditProfile';
import Reiszer from './components/Reiszer';
import SecondaryView from './components/SecondaryView';
import ProfileModal from './components/Chat/ProfileModal';
import EditChat from './components/Edit Chat/EditChat';
import { useSelector } from 'react-redux';
import { selectChosenUser, selectDirectMessageRoom, selectDirectUser, selectRoomDetails, selectRoomId, selectUser } from './features/appSlice';
import CreateChannel from './components/Edit Chat/CreateChannel';
import RemoveAlertModal from './components/Edit Chat/RemoveAlertModal';
import $ from "jquery"
import InitAccount from './components/InitAccount/InitAccount';
function App() {
  const [user, userLoading] = useAuthState(auth);
  // set status to Online
  const [users, usersLoading] = useCollection(db.collection('users'));
  const userDb = users?.docs.find(elem => elem.data().uid === user?.uid);
  const [resize, setRisze] = useState(false)
  const setStatusToOnline = () => {
    (db.collection('users'))?.doc(userDb?.id)?.update({
      isOnline: true
    })
  }
  useEffect(() => {
    if(user&&userDb){
      setStatusToOnline();
    }
  }, [user, userDb])
  // Dragbar Logic
  const [sideBarWidth, setSideBarWidth] = useState(200);
  const [profileWidth, setProfileWidth] = useState(300)
  const handleResizeSideBar = (e) => {
    let prevX = e.clientX;
    window.addEventListener('mousemove',mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove (e) {
        let width = sideBarWidth + e.clientX - prevX;
        setSideBarWidth(width<200?200:width>500?500:width);
    }
    
    function mouseup(){
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }

  }

  const handleResizeChat = (e) =>{
    setRisze(true)
    let prevX = e.clientX;
    let browserWidth = document.body.offsetWidth;
    window.addEventListener('mousemove',mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove (e) {
        let width = profileWidth - e.clientX + prevX;
        setProfileWidth(width<300?300:width>600?600:width);
    }
    
    function mouseup(){
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
      setRisze(false)
    }
  } 
  // End Dragbar

  // Get room details
  const roomDetails = useSelector(selectRoomDetails);
  const roomId = useSelector(selectRoomId);
  const roomDirectId = useSelector(selectDirectMessageRoom);
  const id = roomId?roomId:roomDirectId;
  const directUser = useSelector(selectDirectUser);
  const selectedUser = useSelector(selectChosenUser);

  // Modal stack setting
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
    console.log("Clicked")
  }

  useEffect(() => {
    console.log(toggle)
    console.log($('.modal:visible'))
    $(document).on('shown.bs.modal', '.modal', function(){
      console.log("Added!!!1");
      var zIndex = 1040+(20*$('.modal:visible').length);
      $(this).css('z-index', zIndex);
      setTimeout(function() {
          $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1+`!important`).addClass('modal-stack');

      }, 0);
    });
    
  }, [toggle])
  // Get user info
  const userInf = useSelector(selectUser);
  

  return (
    
    <div className="App" onresize>
        {/* <LogIn/> */}
        

          
          {
          userLoading?<Loading/>:
          (!user) ? (<LogIn/>):
         (!(userInf?.displayName&&userInf?.photoURL)?(<InitAccount/>)
         :<>
         
         <>
          <CreateChannel/>
          <EditChat
          id = {id}
          roomDetails = {roomDetails}
          directUser = {directUser}
          onClick = {handleToggle}
          />
          <EditProfile/>
          <RemoveAlertModal
          uid = {selectedUser?.uid}
          />
          <ProfileModal/>
          <Header user = {user}/>
          <div className="work-space-body">
            <SideBar width={sideBarWidth}/>
            <Reiszer onMouseDown = {handleResizeSideBar}/>
            <Chat
            onClick = {handleToggle}
            />
            <Reiszer onMouseDown = {handleResizeChat}/>
            <SecondaryView width = {profileWidth} resize = {resize}/>
          </div>
      
          </>
          </>)
          }

    </div>
  );
}

export default App;
