import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";

export default function AdminBuilding() {
    const {id} = useParams();
    const [building, setBuilding] = useState({});
    const [loading, setLoading] = useState(false);

    function getData() {
        setLoading(true);
        AxiosInstance.get("buildings/" + id + "/")
            .then((response) => {
                setBuilding(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            {loading ? <Waiting/>
                :
                <>
                    <Typography variant="h6" component="div">Объект - {building.name}</Typography>
                </>
            }
        </Container>
    );
}