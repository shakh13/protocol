import {Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";

export default function MyTextField(props) {
    const {name, control, label, type} = props;
    return (
        <Controller
            name={name}
            control={control}
            render={
                ({
                     field: {onChange, value},
                     fieldState: {error},
                     formState,
                 }) =>
                    <TextField
                        key={name}
                        autoFocus
                        required
                        margin="dense"
                        placeholder={label}
                        type={type}
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                        fullWidth
                        variant="outlined"
                    />
            }
        />
    );
}