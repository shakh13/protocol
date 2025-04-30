import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../components/axios_instance.jsx";
import NotFoundPage from "./not_found_page.jsx";


export default function Protocol() {
    const {id} = useParams();
    const [protocol, setProtocol] = useState(null);

    function getData() {
        AxiosInstance.get("generate-pdf/" + id)
            .then((response) => {
                if (response.status === 404) {
                    setProtocol(null)
                } else {
                    setProtocol(response.data);
                }
            })
            .catch((error) => {
                setProtocol(null);
            })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box>
            {
                protocol === null
                    ? <NotFoundPage/>
                    : <Box sx={{height: '100vh', overflow: 'hidden'}}>
                        <embed
                            src={"http://0.0.0.0:8000/generate-pdf/" + id}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            style={{border: 'none'}}
                        />
                    </Box>
            }
        </Box>
    )
}