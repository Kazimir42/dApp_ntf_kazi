
function InfosAccount (props) {
    return (
        <div>
            {!props.loader && props.accounts.length > 0 ?
                <div>
                    <p>Your connected with account : {props.accounts[0]}</p>
                    <p>Your total ETH : {props.balance}</p>
                    <p>{props.balance < 0.3 ? 'Not enougth ETH to be whitelisted' : 'Enougth ETH to be whitelisted'}</p>
                </div>
                :
                <div>
                    <p></p>
                </div>
            }
        </div>
    )
}
export default InfosAccount;