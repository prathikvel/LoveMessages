import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useAuth, User } from "../../auth";

interface UserSelectProps {
  users: User[];
  name: string;
  value: string;
  onChange: (e: any) => void;
  onBlur: (e: any) => void;
  error: boolean | undefined;
  helperText: string | false | undefined;
}

const UserSelect = ({
  users,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
}: UserSelectProps) => {
  const auth = useAuth();
  const title = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth error={error}>
        <InputLabel id={`${name}-label`}>{title}</InputLabel>
        <Select
          labelId={`${name}-label`}
          label={title}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        >
          {users.map((user) => {
            // if user is not current user
            if (user._id !== auth.user?._id) {
              return (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              );
            }
            return undefined;
          })}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default UserSelect;
