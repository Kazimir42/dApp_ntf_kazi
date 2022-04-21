import {useEffect, useState} from "react";
import {ethers} from 'ethers';
import './App.css';
import InfosAccount from "./components/InfosAccount";
import firebase from "./Firebase";

const ref = firebase.firestore().collection('whiteliste');

function App() {
  const [countData, setCountData] = useState(0);
  const [loader, setLoader] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState();
  const [succes, setSucces] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAccounts();
    setLoader(false);
    getCount();
  }, [])

  //little security to check if app realy try to connect to MM
  window.ethereum.addListener('connect', async (response) => {
    getAccounts();
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

  //get number of user whitelisted in firebase db
  function getCount()
  {
    ref.get().then(function (querySnapshot) {
      setCountData(querySnapshot.size);
      console.log(querySnapshot)
    })
  }

  async function getAccounts() {
    if (typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
      setAccounts(accounts);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //get the eth balance in WEI of connected account
      const balance = await provider.getBalance(accounts[0]);
      // balance WEI -> ETH
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth);
    }
  }


    return (
        <div className="App">
          <button className="connect_btn" onClick={getAccounts}>Connect Metamask</button>
          <InfosAccount loader={loader} accounts={accounts} balance={balance}/>

        </div>
    );

}

export {ref}
export default App;
