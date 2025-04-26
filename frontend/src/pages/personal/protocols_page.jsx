import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Container, IconButton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {useEffect} from "react";
import Waiting from "../../components/Waiting.jsx";
import AxiosInstance from "../../components/axios_instance.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {ForwardToInbox} from "@mui/icons-material";
import DeleteProtocol from "./protocol/delete_protocol.jsx";

export default function ProtocolsPage() {
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedProtocol, setSelectedProtocol] = React.useState(null);

    function getData() {
        setLoading(true);
        AxiosInstance.get("me")
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const handleDeleteProtocol = (protocol) => () => {
        setSelectedProtocol(protocol);
        setOpenDelete(true);
    }

    const handleSendRequest = (id) => () => {
        AxiosInstance.put("update_protocol_status/" + id, {
            status: 2,
        })
            .then(response => {
                getData();
            })
            .catch((error) => {
                console.log(error);
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
                    Протоколы
                </Typography>
                <Button
                    component={Link}
                    variant={"outlined"}
                    href="/create"
                    underline="none"
                >
                    Создать
                </Button>
            </Box>
            <Box sx={{}}>
                {loading
                    ? <Waiting/>
                    : <>
                        <TableContainer component={Paper} sx={{marginY: 2}}>
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
                                    {
                                        user.protocols.map((protocol) => {
                                            let action = (
                                                <Tooltip title="Запрос на редактирование">
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="Запрос на редактирование"
                                                        onClick={handleSendRequest(protocol.id)}
                                                    >
                                                        <ForwardToInbox/>
                                                    </IconButton>
                                                </Tooltip>

                                            );
                                            if (protocol.status === 0) {
                                                action = (
                                                    <Tooltip title="Редактировать">
                                                        <Link href={"/protocol/" + protocol.id} underline="none">
                                                            <IconButton edge="end">
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
                                                );
                                            } else if (protocol.status === 2) {
                                                action = (
                                                    <Tooltip title="Запрос отпрален">
                                                        <IconButton edge="end">
                                                            <HourglassEmptyIcon/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                            }

                                            const bg = [
                                                'transparent',
                                                'rgba(14, 227, 85, 0.42)',
                                                'rgba(14, 106, 227, 0.42)',
                                                'rgba(238, 107, 60, 0.42)',
                                            ]

                                            const tooltips = [
                                                'Можно редактировать',
                                                'Завершен',
                                                'Запрос на редактирование отправлен',
                                                'Отказ на редактирование',
                                            ]

                                            return (
                                                <Tooltip
                                                    title={tooltips[protocol.status]}
                                                    placement="top"
                                                    arrow
                                                    key={protocol.id}
                                                    slotProps={{
                                                        popper: {
                                                            modifiers: [
                                                                {
                                                                    name: 'offset',
                                                                    options: {
                                                                        offset: [0, -14],
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    }}
                                                >
                                                    <TableRow
                                                        sx={{backgroundColor: bg[protocol.status]}}
                                                    >
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
                                                            {action}
                                                            <Tooltip title="Удалить">
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="Удалить"
                                                                    sx={{marginLeft: '5px'}}
                                                                    onClick={handleDeleteProtocol(protocol)}
                                                                >
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </Tooltip>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            openDelete &&
                            <DeleteProtocol
                                open={openDelete}
                                setOpen={setOpenDelete}
                                updateData={getData}
                                protocol={selectedProtocol}
                            />
                        }
                    </>
                }
            </Box>
        </Container>
    )
}