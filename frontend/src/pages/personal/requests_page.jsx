import * as React from 'react';
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import {Container, IconButton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Waiting from "../../components/Waiting.jsx";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Link from "@mui/material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import NoData from "../../components/NoData.jsx";
import Swal from "sweetalert2";

export default function RequestsPage() {
    const [filteredProtocols, setFilteredProtocols] = useState([]);
    const [loading, setLoading] = useState(false);

    function getData() {
        setLoading(true);
        AxiosInstance.get("me")
            .then((response) => {
                setFilteredProtocols(response.data?.protocols.filter((protocol) => protocol.status === 2));
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

    const handleCancel = (id) => () => {
        AxiosInstance.put("update_protocol_status/" + id, {
            status: 1,
        })
            .then(response => {
                getData();
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    return (
        <Container>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{padding: '0 10px', marginY: 'auto'}}
                >
                    Запросы на редактирование
                </Typography>
            </Box>
            <Box>
                {
                    loading
                        ? <Waiting/>
                        : filteredProtocols.length === 0
                            ? <NoData/>
                            :
                            <TableContainer component={Paper} sx={{marginY: 2}}>
                                <Table sx={{minWidth: 650}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Протокол</TableCell>
                                            <TableCell align="left">Заказчик</TableCell>
                                            <TableCell align="left">Объект</TableCell>
                                            <TableCell align="center">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            filteredProtocols.map((protocol) => (
                                                <TableRow key={protocol.id}>
                                                    <TableCell>
                                                        <Link href={"/protocol/" + protocol.id} underline="none">
                                                            {
                                                                protocol.building
                                                                    ? protocol.building.prefix + ' - ' + protocol.id
                                                                    : protocol.id
                                                            }
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{protocol.client.name}</TableCell>
                                                    <TableCell>{protocol.building?.name}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="text"
                                                            onClick={handleCancel(protocol.id)}
                                                        >
                                                            Отменить
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                }

            </Box>
        </Container>
    )
}