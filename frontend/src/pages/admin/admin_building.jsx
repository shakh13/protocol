import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";

export default function AdminBuilding() {
    const {id} = useParams();
    return (
        <Container fluid>
            <Typography variant="h6" component="div">Объект #{id}</Typography>
        </Container>
    );
}