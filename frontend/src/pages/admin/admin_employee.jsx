import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";

export default function AdminEmployee() {
    const {id} = useParams();
    return (
        <Container>
            <Typography variant="h6" component="div">Сотрудник #{id}</Typography>
        </Container>
    );
}