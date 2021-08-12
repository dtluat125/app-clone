import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getDataState, selectDocId, selectUser } from "../../features/appSlice";
import { db, storage } from "../../firebase";
function InputSection(props) {
  const user = useSelector(selectUser);
  const inputInit =
    props.name === "displayName"
      ? user?.displayName
        ? user.displayName
        : ""
      : props.name === "whatIDo"
      ? user?.whatIDo
        ? user.whatIDo
        : ""
      : "";
  const [input, setInput] = useState(inputInit);
  const [imgUrl, setImgUrl] = useState(user?.photoURL);
  const dispatch = useDispatch();
  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setImgUrl(await fileRef.getDownloadURL());
  };

  const handleUpload = () => {
    inputElement.click();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const [users, loading] = useCollection(db.collection("users"));
  const selectedDoc = users?.docs.find((elem) => elem.data().uid === user?.uid);
  const id = selectedDoc?.id;
  const saveChange = async () => {
    let users = db.collection("users");
    if (!loading && id && users) {
      if (props.saveChange) {
        if (props.type === "photo") {
          await users
            .doc(id)
            .update({
              photoURL: imgUrl,
            })
            .catch((err) => alert(err.message));
        } else if (props.type === "text") {
          if (props.name === "displayName")
            await users
              .doc(id)
              .update({
                displayName: input,
              })
              .catch((err) => alert(err.message));
          else if (props.name === "whatIDo")
            await users
              .doc(id)
              .update({
                whatIDo: input,
              })
              .catch((err) => alert(err.message));
        }
        dispatch(
          getDataState({
            dataUpdated: true,
          })
        );
      }
    }
  };

  useEffect(() => {
    saveChange();
    return () => {
      dispatch(
        getDataState({
          dataUpdated: null,
        })
      );
    };
  }, [props.toggle]);
  let inputElement;

  return (
    <div className="input-container">
      <label htmlFor="" className="form-label">
        {props.label}
      </label>
      {props.type === "photo" ? (
        <div>
          <img src={imgUrl} alt="" style={{ width: `100%` }} />
          <input
            ref={(input) => (inputElement = input)}
            type="file"
            onChange={handleImgChange}
            className="photo-input"
          />
          <span
            role="button"
            className="upload-button c-button--medium"
            onClick={handleUpload}
          >
            Upload an image{" "}
          </span>
        </div>
      ) : (
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
}

export default InputSection;
