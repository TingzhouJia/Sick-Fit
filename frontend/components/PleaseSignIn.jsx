import {useQuery,gql} from '@apollo/client'
import SignIn from './SignIn'
import {CURRENT_USER_QUERY} from './Nav'
const PleaseSign=props=>{
    const {loading,error,data}=useQuery(CURRENT_USER_QUERY)
    if(loading)return <p>Loading...</p>
    if(!data.me){
        return(<>
            <p>Please Sign In to Continue</p>
            <SignIn/>
        </>)
    }
    return (props.children)
}
export default PleaseSign