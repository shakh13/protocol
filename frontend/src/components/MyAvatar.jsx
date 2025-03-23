import {Avatar} from "@mui/material";
import * as React from "react";

export default function MyAvatar({fullname}) {
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
        }
        return color;
    };

    return (
        <Avatar sx={{bgcolor: stringToColor(fullname)}}>
            {fullname[0]}
        </Avatar>
    );
}