import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../components/axios_instance.jsx";
import NotFoundPage from "./not_found_page.jsx";


export default function Protocol() {
    const {id} = useParams();
    const [protocolExists, setExistsProtocol] = useState(false);

    function getData() {
        AxiosInstance.get("generate-pdf/" + id)
            .then((response) => {
                if (response.status === 404) {
                    setExistsProtocol(false)
                } else {
                    setExistsProtocol(true);
                }
            })
            .catch((error) => {
                setExistsProtocol(false);
            })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box>
            {
                protocolExists === null
                    ? <NotFoundPage/>
                    : <Box sx={{height: '100vh', overflow: 'hidden'}}>
                        <embed
                            src={"http://localhost:8000/generate-pdf/" + id}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            style={{border: 'none'}}
                        />
                    </Box>
            }
        </Box>
    );
}