import * as React from "react";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Controller} from "react-hook-form";
import dayjs from "dayjs";


export default function MyDatePickerField(props) {
    const {label, name, control} = props
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={control}
                render={({
                             field: {onChange, value},
                             fieldState: {error}
                         }) => (
                    <DatePicker
                        required
                        placeholder={label}
                        sx={{width: '100%', marginY: '7px'}}
                        onChange={onChange}
                        format="DD.MM.YYYY"
                        value={value ? dayjs(value) : null}
                        slotProps={{
                            textField: {
                                error: !!error,
                                helperText: error?.message,
                            }
                        }}
                    />
                )}/>
        </LocalizationProvider>
    );
}