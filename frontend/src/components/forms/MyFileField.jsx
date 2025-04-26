import * as React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Controller} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import {FormHelperText} from "@mui/material";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function MyFileField(props) {
    const {name, label, control} = props;
    return (
        <Controller
            name={name}
            defaultValue={null}
            control={control}
            render={
                ({
                     field: {onChange, ref},
                     fieldState: {error},
                     formState,
                 }) =>
                    <>
                        <FormControl sx={{width: '100%', marginY: '8px'}}>
                            <Button
                                component="label"
                                variant="outlined"
                                sx={{height: "55px"}}
                                startIcon={<CloudUploadIcon/>}
                            >
                                {label}
                                <VisuallyHiddenInput
                                    type="file"
                                    ref={ref}
                                    accept="image/*"
                                    error={!!error}
                                    onChange={(e) => {
                                        const file = e.target.files[0]; // Extract file
                                        onChange(file); // Pass file to react-hook-form
                                    }}
                                />
                            </Button>
                            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                        </FormControl>
                    </>
            }
        />
    );
}