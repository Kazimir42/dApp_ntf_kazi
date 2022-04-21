import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import {ref} from "./../App";
import firebase from "./../Firebase";

function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logged, setLogged] = useState(false);

    useEffect(() => {

    },[])

    function loggin()
    {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                setLogged(true);
                console.log('login successful');
            }).catch((error) => {
                console.log('login fail');
        })
    }

    return (
      <div>
        Admin
          {!logged
              ?
              <div>
                  Loggin :<br />
                  <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
                  <br />
                  <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
                  <br />
                  <button onClick={loggin}>Loggin</button>
              </div>
              :
              <div>PANEL ADMIN</div>
          }
      </div>
    );
}
export default Admin;