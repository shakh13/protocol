import {Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";

export default function MyTextField(props) {
    const {name, control, label, type, defaultValue, adornment} = props;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({
                         field: {onChange, value},
                         fieldState: {error},
                     }) => {
                return (
                    <TextField
                        key={name}
                        label={label}
                        margin="dense"
                        placeholder={label}
                        type={type ?? "text"}
                        onChange={(e) => {
                            onChange(e.target.value ?? "");
                        }}
                        value={value ?? ''}
                        slotProps={{
                            input: {
                                endAdornment: adornment ? (
                                    <InputAdornment position="end">{adornment}</InputAdornment>
                                ) : undefined,
                            },
                            htmlInput: type === 'number'
                                ? {max: 100, min: 0}
                                : {},
                        }}
                        error={!!error}
                        helperText={error?.message}
                        fullWidth
                        variant="outlined"
                    />
                );
            }}
        />
    );
}