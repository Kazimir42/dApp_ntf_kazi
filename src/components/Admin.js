import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import {ref} from "./../App";
import firebase from "./../Firebase";

function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logged, setLogged] = useState(false);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        setLoaded(true)
    },[data])

    function login()
    {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                setLogged(true);
                console.log('login successful');
                getData();
            }).catch((error) => {
                console.log('login fail');
        })
    }

    function getData() {

        ref.onSnapshot((querySnapShot) => {
            const items = [];
            querySnapShot.forEach((doc) => {
                items.push(doc.data());
            });
            setData(items)
        }).catch((error) => {
            console.log(error)
        })
    }

    function deleteAddress(e) {
        ref.doc(e.target.value).delete()
    }

    function addOnWhitelist()
    {
        let balance = 0;
        let id = uuidv4();

        let object = {address: address, balance: balance, id: id}

        ref.doc(object.id).set(object)
            .then(result => {
                console.log('successful added');
            }).catch((err) => {
            console.log('error');
        })
        getData();
    }

    return (
      <div>
        Admin
          {!logged
              ?
              <div>
                  Login :<br />
                  <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
                  <br />
                  <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
                  <br />
                  <button onClick={login}>Login</button>
              </div>
              :
              <div>
                  PANEL ADMIN
                  <br /><br />
                  listing of addresses in whitelist
                  {
                      loaded &&
                          data.map(elem => {
                              return <li key={elem.id}>{elem.address} | {elem.balance} eth <button onClick={deleteAddress} value={elem.id}>delete</button> </li>
                          })
                  }
                  <br /><br />
                  Add address on whitelist
                  <input type="text" onChange={e => setAddress(e.target.value)} />
                  <button onClick={addOnWhitelist}>Add on whitelist</button>

              </div>
          }
      </div>
    );
}
export default Admin;