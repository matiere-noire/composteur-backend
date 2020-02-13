import React from 'react'
import { Datagrid, EditButton, Filter, List, ReferenceField, SelectField, SelectInput, ShowButton, TextField, TextInput } from 'react-admin'
import { enumDroits } from '../Enums'

const UserComposterFilter = props => (
  <Filter {...props}>
    <TextInput label={'resources.users.fields.email'} source="user.email" alwaysOn />
    <TextInput label={'resources.user_composters.fields.composter'} source="composter.name" alwaysOn />
    <TextInput label={'resources.users.fields.lastname'} source="user.lastname" />
    <SelectInput source="capability" choices={enumDroits} />
  </Filter>
)

const UserComposterList = props => (
  <List {...props} filters={<UserComposterFilter />} sort={{ field: 'id', order: 'ASC' }} perPage={25}>
    <Datagrid>
      <ReferenceField source="user" reference="users" link={'show'} sortable={false}>
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="composter" reference="composters" link={'show'} sortable={false}>
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="capability" choices={enumDroits} addLabel sortable={false} />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
)

export default UserComposterList
