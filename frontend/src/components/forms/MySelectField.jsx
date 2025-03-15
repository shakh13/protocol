import {Controller} from "react-hook-form";
import Box from "@mui/material/Box";
import Select from "react-select";
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import {FormHelperText} from "@mui/material";

export default function MySelectField(props) {
    const {name, control, label, options} = props;

    const selectColorStyles = {
        option: (styles) => ({
            ...styles,
            backgroundColor: 'transparent',
            color: 'black',
        }),
    }

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
                    <>
                        <FormControl sx={{width: '100%'}}>
                            <Box sx={{height: '10px'}}/>
                            <Select
                                placeholder={label}
                                fullWidth
                                options={options}
                                styles={selectColorStyles}
                                onChange={onChange}
                                value={value}
                                error={!!error}
                                className="basic-multi-select selectCustom"
                                classNamePrefix="select"
                            />
                            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                        </FormControl>
                    </>
            }
        />
    );
}