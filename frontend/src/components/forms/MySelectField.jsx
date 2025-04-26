import {Controller, useForm} from "react-hook-form";
import Box from "@mui/material/Box";
import Select from "react-select";
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import {FormHelperText} from "@mui/material";

export default function MySelectField(props) {
    const {name, control, label, options, onSelected} = props;

    const selectColorStyles = {
        option: (styles) => ({
            ...styles,
            backgroundColor: 'white',
            color: 'black',
        }),
        menu: (styles) => ({
            ...styles,
            // height: 400, // Set max height of the dropdown
            // overflowY: "auto", // Enable scrolling if options exceed height
            zIndex: 99999,
        }),
        // menuList: (styles) => ({
        //     ...styles,
        //     height: 300, // Set max height of the option list
        //     overflowY: "auto", // Enable scrolling
        //     backgroundColor: 'white',
        // }),
    }


    return (
        <Controller
            name={name}
            control={control}
            defaultValue={null}
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
                                className="basic-single"
                                classNamePrefix="select"
                                label={label}
                                placeholder={label}
                                fullWidth
                                options={options}
                                styles={selectColorStyles}
                                onChange={(selected) => {
                                    onChange(selected);
                                    if (onSelected)
                                        onSelected(selected);
                                }}
                                value={value}
                                error={!!error}
                            />
                            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                        </FormControl>
                    </>
            }
        />
    );
}