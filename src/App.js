import {useEffect, useState} from "react";
import {ethers} from 'ethers';
import './App.css';

function App() {
  const [loader, setLoader] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState();
  const [succes, setSucces] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAccount();
    setLoader(false);
  }, [])

  //little security to check if app realy try to connect to MM
  window.ethereum.addListener('connect', async(response) => {
    getAccount();
  });

  //refresh page if user switch account
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });

  //refresh page if user switch network
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });

  //refresh page if user disconnect
  window.ethereum.on('disconnect', () => {
    window.location.reload();
  });

  async function getAccount() {
    if (typeof window.ethereum !== 'undefined')
    {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
      setAccounts(accounts);
    }
  }


  return (
    <div className="App">
      {!loader && accounts.length > 0?
          <p>Your connected with account : {accounts[0]}</p>
          :
          <div>
            <p>Not connected</p>
            <button onClick={getAccount}>Connect</button>
          </div>
      }
    </div>
  );
}

export default App;
