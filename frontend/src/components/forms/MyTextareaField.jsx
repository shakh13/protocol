import {Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {InputAdornment, TextareaAutosize} from "@mui/material";

export default function MyTextareaField(props) {
    const {name, control, label, defaultValue} = props;
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
                    <TextareaAutosize
                        key={name}
                        minRows={2}
                        style={{width: '100%', padding: '10px'}}
                        label={label}
                        margin="dense"
                        // placeholder={label}
                        onChange={onChange}
                        value={value ?? ""}
                        defaultValue={defaultValue}
                        // error={!!error}
                        variant="outlined"
                    />
            }
        />
    );
}