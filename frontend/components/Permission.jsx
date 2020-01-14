import {useQuery,gql} from '@apollo/client'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'
const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
  ];
  
  const ALL_USERS_QUERY = gql`
    query {
      users {
        id
        name
        email
        permissions
      }
    }
  `;

  const Permission=props=>{
      const {error, data}=useQuery(ALL_USERS_QUERY)
      return(
        <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => <th>{permission}</th>)}
                <th>👇🏻</th>
              </tr>
            </thead>
            <tbody>{data?data.users.map(user => <User user={user} />):<p>Not Enough Permission</p>}</tbody>
          </Table>
        </div>
      </div>
      )
  }

  const User=props=>{
    const user=props.user
    return(
        <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    )
  }
  export default Permission