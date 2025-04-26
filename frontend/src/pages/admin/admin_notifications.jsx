import {Avatar, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {cloneElement, useEffect, useState} from "react";
import {Cancel, Close, Done, Padding, RemoveRedEye} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import Box from "@mui/material/Box";
import NoData from "../../components/NoData.jsx";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}

export default function AdminNotifications() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    function getData() {
        setLoading(true);
        AxiosInstance.get('edit_protocol_requests')
            .then((response) => {
                setRequests(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const sendRequest = (id, status) => () => {
        AxiosInstance.put(`update_protocol_status/${id}`, {
            status: status,
        })
            .then(response => {
                getData();
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
            <Typography variant={"h6"} component={"div"}>Запросы на редактирование</Typography>
            {
                loading
                    ? <Waiting/>
                    : <Box>
                        {requests.length === 0
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
                                        {requests.map((protocol, index) => (
                                            <TableRow key={protocol.id}>
                                                <TableCell>
                                                    <Link href={"/admin/protocol/" + protocol.id} underline="none">
                                                        {
                                                            protocol.building
                                                                ? protocol.building.prefix + ' - ' + protocol.id
                                                                : protocol.id
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
                                                    <Tooltip title="Отказатся">
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="Отказатся"
                                                            onClick={sendRequest(protocol.id, 3)}
                                                        >
                                                            <Close/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Разрешить">
                                                        <IconButton
                                                            sx={{marginLeft: '5px'}}
                                                            edge="end"
                                                            aria-label="Разрешить"
                                                            variant="contained"
                                                            onClick={sendRequest(protocol.id, 0)}
                                                        >
                                                            <Done/>
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

            }
        </Container>
    );
}