import Box from "@mui/material/Box";
import * as React from "react";

export default function ErrorMessage(props) {
    const {message} = props;
    return (
        <Box sx={{color: "red", fontSize: "14px", textAlign: "center", width: "100%"}}>
            {message}
        </Box>
    );
}