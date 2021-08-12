import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/setuppage.css";
import { reset, saveUserInfo, selectDocId, selectUser } from "../../features/appSlice";
import { auth, db, storage } from "../../firebase";
import SmallLoader from "../SmallLoader";
function InitAccount() {
  const handleUpload = () => {
    inputRef.click();
  };
  //   Handle input
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [notif, setNotif] = useState("");
  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    setLoading(true);
    await fileRef.put(file);
    setImgURL(await fileRef.getDownloadURL());
    setLoading(false);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleJobChange = (e) => {
    setJob(e.target.value);
  };
  // Handle Save Change
  const dispatch = useDispatch();
  const userInf = useSelector(selectUser);
  const id = useSelector(selectDocId);
  const saveChange = async () => {
    let users = await db.collection("users");
    if (id) {
      users
        .doc(id)
        .update({
          photoURL: imgURL,
        })
        .then(() => console.log("Clicked"))
        .catch((err) => alert(err.message));

      users
        .doc(id)
        .update({
          displayName: name,
        })
        .then(() => {
          dispatch(
            saveUserInfo({
              user: {
                displayName: name,
                WhatIDo: job,
                photoURL: imgURL,
                uid: userInf.uid,
                email: userInf.email,
                emailVerified: userInf.emailVerified,
                isOnline: true,
              },
            })
          );
        })
        .catch((err) => alert(err.message));

      users
        .doc(id)
        .update({
          whatIDo: job,
        })
        .catch((err) => alert(err.message));
    }
  };
  const onSaveHandler = () => {
    setOnSave(true);
  };
  useEffect(() => {
    if (onSave) {
      saveChange();
      if (name === "" || job === "")
        setNotif("You have to fill the information!");
      if (imgURL === "") setNotif("You have to upload an image!");
    }
    return () => {
      setOnSave(false);
      setNotif("");
    };
  }, [onSave]);
  // Sign Out
  const logOut = async () => {
    await auth
      .signOut()
      .then(() => {
        db.collection("users").doc(id).update({
          isOnline: false,
        });
      })
      .catch((error) => alert(error.message));
    dispatch(
      reset({
        initState: null,
      })
    );
  };
  let inputRef;

  return (
    <div className="setup-page-container">
      <h2>Please enter your basic information</h2>
      <div className="setup-page__inner">
        <div className="setup-page__collumns">
          <div className="collumn setup-page__collumn photo-column ">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                <strong>Photo</strong>
              </label>
              <div className="image-holder-container">
                <div
                  className="image-holder"
                  style={{ backgroundImage: `url(${imgURL})` }}
                >
                  {loading && <SmallLoader />}
                </div>
              </div>

              <input
                ref={(input) => (inputRef = input)}
                type="file"
                className="form-control photo-input"
                accept="img/*"
                onChange={handleImgChange}
              />
              <span
                role="button"
                className="upload-button c-button--medium btn-success"
                onClick={handleUpload}
              >
                Upload an image{" "}
              </span>
            </div>
          </div>
          <div className=" collumn setup-page__collumn info-column">
            <div className="form-group">
              <label className="form-label">
                <strong>Display name</strong>{" "}
              </label>
              <input
                value={name}
                onChange={handleNameChange}
                type="text"
                className="form-control"
              />
            </div>
            <br />
            <div className="form-group">
              <label className="form-label">
                <strong>What you do</strong>
              </label>
              <input
                value={job}
                onChange={handleJobChange}
                type="text"
                className="form-control "
              />
            </div>
            <br />
          </div>
        </div>
        <br />
        <div className="button-container">
          <button className="btn btn-secondary" onClick={logOut}>
            Use another account
          </button>
          <button className="btn btn-success" onClick={onSaveHandler}>
            Proceed to the server
          </button>
        </div>
        <div className="notif-container"><strong>{notif}</strong></div>
      </div>
    </div>
  );
}

export default InitAccount;
