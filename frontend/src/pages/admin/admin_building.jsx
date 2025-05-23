import {Container, IconButton, List, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Waiting from "../../components/Waiting.jsx";
import * as React from "react";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import {useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import NoData from "../../components/NoData.jsx";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Link from "@mui/material/Link";
import {Close, Done} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

export default function AdminBuilding() {
    const {id} = useParams();
    const [building, setBuilding] = React.useState({});
    const [loading, setLoading] = useState(true);

    function getData() {
        setLoading(true);
        AxiosInstance.get("buildings/" + id + "/")
            .then((response) => {
                setBuilding(response.data);
                setLoading(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
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
                        <Typography variant="h6" component="div">
                            Объект: {building.name}
                        </Typography>
                        <Typography variant="body1" component="div" color={"textSecondary"}>
                            Протокол: {building.prefix}
                        </Typography>

                        <Box>
                            {building.protocols.length === 0
                                ? <NoData/>
                                : <TableContainer component={Paper} sx={{marginY: 2}}>
                                    <Table sx={{minWidth: 650}} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Протокол</TableCell>
                                                <TableCell align="left">Заказчик</TableCell>
                                                <TableCell align="left">Объект</TableCell>
                                                <TableCell align="right">Действия</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {building.protocols.map((protocol, index) => (
                                                <TableRow key={protocol.id}>
                                                    <TableCell>
                                                        <Link href={"/admin/protocol/" + protocol.id} underline="none">
                                                            {
                                                                protocol.building
                                                                    ? protocol.building.prefix + ' - ' + protocol.building_protocol_number
                                                                    : protocol.building_protocol_number
                                                            }
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={"/admin/client/" + protocol.client.id}
                                                            underline="none"
                                                        >
                                                            {protocol.client.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {protocol.building &&
                                                            <Link
                                                                href={"/admin/building/" + protocol.building.id}
                                                                underline="none"
                                                            >
                                                                {protocol.building.name}
                                                            </Link>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Удалить">
                                                            <IconButton
                                                                sx={{marginLeft: '5px'}}
                                                                edge="end"
                                                                variant="contained"
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </Box>
                    </>
            }
        </Container>
    )
}