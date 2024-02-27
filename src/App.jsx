import './App.css'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useState, useRef } from 'react';


const firebaseConfig = {
  apiKey: "AIzaSyDQWWHtB3AknVWCl04EYk8oaFHfmgXdQcc",
  authDomain: "chatwow-12530.firebaseapp.com",
  projectId: "chatwow-12530",
  storageBucket: "chatwow-12530.appspot.com",
  messagingSenderId: "687092531792",
  appId: "1:687092531792:web:00fa9243ee1a1203ddc755",
  measurementId: "G-VT1N85Q6PG"
};

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <div className="name">
          <img src="logo.svg" alt="" className='logo'/>
          <h3>ChatWow</h3>
          <SignOut />
        </div>
      </header>
      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
  }

  return (
      <div className="sign_in">
        <button onClick={signInWithGoogle} className='sign_in_btn'>
          <img src="google-icon.svg" alt="google icon" className="google_icon"/>
          Sign In With Google
        </button> 
      </div>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()} className='sign_out_btn'>Sign Out</button>

  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(100);

  const [messages] = useCollectionData(query, {idField: 'id'})
  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();
    setFormValue("")

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    dummy.current.scrollIntoView({ behaviour: 'smooth' })
  }
 
  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      
        <div ref={dummy}></div>
      </div>

      <form action="" onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type='submit'>
          <img src="send.svg" alt="send icon" />
        </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App
