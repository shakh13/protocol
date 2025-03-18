import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";

export default function Waiting() {
    return (
        <Box sx={{padding: '10px', width: '100%'}}>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
        </Box>
    );
}