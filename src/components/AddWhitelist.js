import React from 'react';

function AddWhitelist(props) {

    function registerToWhitelist()
    {

    }

    return (
        <div>
            {
                props.balance > 0.3?
                <button className="btn" onClick={() => {
                    registerToWhitelist({address: props.accounts[0], balance: props.balance})
                }}>Be Whitelisted (not working)</button>
                :
                ''
            }

        </div>
    );
}

export default AddWhitelist;