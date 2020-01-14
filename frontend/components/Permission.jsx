import {useQuery,gql,useMutation} from '@apollo/client'
import React, {useState} from 'react'
import Error from './ErrorMessage'
import Table from './styles/Table'
import {PropTypes} from 'prop-types'
import SickButton from './styles/SickButton'
const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
  ];
  
  const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

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
      const {error, data,loading}=useQuery(ALL_USERS_QUERY)
      return(
        <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          {loading?<p>loading</p>:null}
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                <th>👇🏻</th>
              </tr>
            </thead>
            <tbody>{data?data.users.map(user => <User user={user}  key={user.id}  />):<p>Not Enough Permission</p>}</tbody>
          </Table>
        </div>
      </div>
      )
  }

  const User=props=>{
    const [updateupdatePermissions,{loading,error}]=useMutation(UPDATE_PERMISSIONS_MUTATION)
    const user=props.user
    const [permissions,setPermissions]=useState(props.user.permissions)
    const handlePermissionChange = (e) => {
      const checkbox = e.target;
      // take a copy of the current permissions
      let updatedPermissions = [...permissions];
      // figure out if we need to remove or add this permission
      if (checkbox.checked) {
        // add it in!
        updatedPermissions.push(checkbox.value);
      } else {
        updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
      }
      setPermissions(updatedPermissions) 
    };
    return(
      <>
        {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
        <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td>
            <label htmlFor={`${user.id}-permission-${permission}`}>
            <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={handlePermissionChange}
                    />
            </label>
          </td>
        ))}
        <td>
          <SickButton type='button' disabled={loading} onClick={updateupdatePermissions}>Update</SickButton>
        </td>
      </tr>
      </>
    )
  }
  User.propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };
  export default Permission