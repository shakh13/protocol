import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function NoData(props) {
    const {message = "Нет данных"} = props;
    return (
        <Box sx={{
            width: '100%',
            padding: '10px',
            textAlign: 'center',
        }}>
            <Typography variant={"body2"} color={"textSecondary"}>{message}</Typography>
        </Box>
    );
}