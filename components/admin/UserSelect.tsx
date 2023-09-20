import {
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  Typography,
} from "@mui/joy";
import * as React from "react";

type User = {
  username: string;
  role: string;
};

export default function UserSelect({ username, users, name, onChange }) {
  const options: User[] = users
    .map((user) => {
      if (user.username !== username && user.role !== "owner") {
        return user;
      } else {
        return null;
      }
    })
    .filter((username) => username !== null);

  return (
    <Autocomplete
      name={name}
      placeholder="username"
      onChange={onChange}
      sx={{ width: "100%" }}
      options={options}
      getOptionLabel={(option: User) => option.username}
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
          <ListItemContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {option.username}
            <Typography level="body-sm">{option.role}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
