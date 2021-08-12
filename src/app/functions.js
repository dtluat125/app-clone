import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

export const GetUserByUid = (uid) => {
    const [users] = useCollection(db.collection('users'));
    const user = users?.docs.find(doc => doc.data().uid === uid);
    return user?.data();
}
