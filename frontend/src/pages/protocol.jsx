import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../components/axios_instance.jsx";
import NotFoundPage from "./not_found_page.jsx";
import Waiting from "../components/Waiting.jsx";
import Spinner from "../components/Spinner.jsx";


export default function Protocol() {
    const {id} = useParams();
    const [protocolExists, setExistsProtocol] = useState(0);

    function getData() {
        AxiosInstance.get("generate-pdf/" + id)
            .then((response) => {
                if (response.status === 404) {
                    setExistsProtocol(1)
                } else {
                    setExistsProtocol(2);
                }
            })
            .catch((error) => {
                setExistsProtocol(1);
            })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box>
            {
                protocolExists === 0 ? <Spinner/> : (protocolExists === 1
                    ? <NotFoundPage/>
                    : <Box sx={{height: '100vh', overflow: 'hidden'}}>
                        <embed
                            // src={"http://0.0.0.0:8000/generate-pdf/" + id}
                            src={"http://185.191.141.127:8000/generate-pdf/" + id}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            style={{border: 'none'}}
                        />
                    </Box>)
            }
        </Box>
    );
}