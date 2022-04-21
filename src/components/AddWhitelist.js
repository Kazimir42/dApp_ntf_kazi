import React from 'react';
import {ref} from "../App";
import { v4 as uuidv4 } from 'uuid';

function AddWhitelist(props) {

    function createDoc(object)
    {

        //check if eth address is valid
        if (object.address.match(/^0x[a-fA-F0-9]{40}$/)){
            //Whitelist limit exceeded ?
            if (props.countData < 5) {
                //address already exist ?
                let i = 0;
                ref.where('address', '==', object.address)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            i++;
                        })
                        //if address not found in bdd, add in whitelist
                        if (i === 0)
                        {
                            //if balance is > 0.3
                            if (props.balance >= 0.3)
                            {
                                ref.doc(object.id).set(object)
                                    .then(result => {
                                        props.setSuccess('You have been added to the whitelist');
                                        props.setError('');
                                    }).catch((err) => {
                                    props.setSuccess('');
                                    props.setError('error when adding to whitelist')
                                })
                            }else
                            {
                                props.setSuccess('');
                                props.setError('not enougth ETH (min 0.3)')
                            }

                        }else
                        {
                            props.setSuccess('');
                            props.setError('already in whitelist')
                        }
                    })
                    .catch(function (error) {
                        props.setSuccess('');
                        props.setError('error when access to whitelist')
                    })
            }else
            {
                props.setSuccess('');
                props.setError('Whitelist is full')
            }
        }else
        {
            props.setSuccess('');
            props.setError('Invalid adress')
        }

        //refresh count
        //UGLY CHANGE THIS
        setTimeout(props.getCount, 500);

    }

    return (
        <div>
            <button className="btn" onClick={() => {
                createDoc({address: props.accounts[0], id: uuidv4(), balance: props.balance})
            }}>Be Whitelisted</button>
        </div>
    );
}

export default AddWhitelist;