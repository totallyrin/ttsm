import { Option, Select } from "@mui/joy";
import * as React from "react";

export default function RoleSelect({ name, onChange }) {
  return (
    <Select name={name} defaultValue="user" onChange={onChange}>
      <Option value="no-auth">no-auth</Option>
      <Option value="user">user</Option>
      <Option value="admin">admin</Option>
    </Select>
  );
}
