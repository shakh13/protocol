import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import * as yup from "yup";
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import EditProtocol from "./protocol/edit_protocol.jsx";
import ViewProtocol from "./protocol/view_protocol.jsx";
import {Container, IconButton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Waiting from "../../components/Waiting.jsx";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import Link from "@mui/material/Link";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function ProtocolPage() {
    const {id} = useParams();
    const [protocol, setProtocol] = useState({});
    const [loading, setLoading] = useState(true);
    const [availableMachines, setAvailableMachines] = useState([]);


    function getData() {
        setLoading(true);
        AxiosInstance.get("protocol/" + id)
            .then((response) => {
                console.log(response.data);
                setProtocol(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        AxiosInstance.get("machines/")
            .then((response) => {
                let m = [];
                response.data.map((machine) => {
                    m.push({
                        value: machine.id,
                        label: machine.name,
                    })
                })
                setAvailableMachines(m);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Container>
            {
                loading
                    ? <Waiting/>
                    : <>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <Typography
                                variant="h6"
                                component="div"
                            >
                                ПРОТОКОЛ
                                ИСПЫТАНИЙ {protocol.building?.prefix ? ` ${protocol.building.prefix}-${id}` : ` № ${id}`} от {dayjs(protocol.start_date).format('DD.MM.YYYY')}г.
                            </Typography>

                            {protocol.status === 1 &&
                                <Tooltip title="Скачать PDF">
                                    <IconButton
                                        component={Link}
                                        variant={"text"}
                                        href={"/protocol-pdf"}
                                        underline="none"
                                    >
                                        <CloudDownloadIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </Box>
                        <Grid
                            container
                            marginY={2}
                            direction="row"
                            sx={{
                                '--Grid-borderWidth': '1px',
                                borderTop: 'var(--Grid-borderWidth) solid',
                                borderLeft: 'var(--Grid-borderWidth) solid',
                                borderColor: 'divider',
                                '& > div': {
                                    borderRight: 'var(--Grid-borderWidth) solid',
                                    borderBottom: 'var(--Grid-borderWidth) solid',
                                    borderColor: 'divider',
                                },
                                color: "textSecondary",
                            }}
                        >
                            <Grid size={3} p={1}>
                                Заказчик
                            </Grid>
                            <Grid size={9} p={1}>
                                {protocol.client?.name}
                            </Grid>
                            {protocol.building !== null &&
                                <>
                                    <Grid size={3} p={1}>
                                        Объект
                                    </Grid>
                                    <Grid size={9} p={1}>
                                        {protocol.building?.name}
                                    </Grid>
                                </>
                            }
                            <Grid size={3} p={1}>
                                Протокол
                            </Grid>
                            <Grid size={9} p={1}>
                                {protocol.type?.name}
                            </Grid>

                        </Grid>
                        {
                            protocol.status === 0 &&
                            <EditProtocol
                                protocol={protocol}
                                availableMachines={availableMachines}
                            />
                        }
                        {
                            protocol.status > 0 && <ViewProtocol protocol={protocol}/>
                        }
                    </>
            }
        </Container>
    )
}