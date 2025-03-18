import TextField from "@mui/material/TextField";
import * as React from "react";

export default function MySearchField(props) {
    const {setSearchFilter, name} = props;
    return (
        <TextField
            id={name}
            label="Поиск"
            variant="outlined"
            size="small"
            onChange={(e) => setSearchFilter(e.target.value)}
            sx={{
                minWidth: '100px',
                width: '300px',
                margin: 'auto 15px auto auto',
            }}
        />
    );
}