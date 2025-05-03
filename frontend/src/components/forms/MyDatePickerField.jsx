import * as React from "react";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Controller} from "react-hook-form";
import dayjs from "dayjs";
import 'dayjs/locale/ru';


export default function MyDatePickerField(props) {
    const {label, name, control} = props
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Controller
                name={name}
                control={control}
                render={({
                             field: {onChange, value},
                             fieldState: {error}
                         }) => (
                    <DatePicker
                        label={label}
                        required
                        placeholder={label}
                        sx={{width: '100%', marginY: '7px'}}
                        onChange={(newValue) => {
                            // Pass null to form if no date selected
                            onChange(newValue ? newValue.toISOString() : null);
                        }}
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