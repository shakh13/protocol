import {Container, IconButton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import NoData from "../../components/NoData.jsx";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Link from "@mui/material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from "react";
import DeleteProtocol from "../personal/protocol/delete_protocol.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

export default function AdminProtocols(props) {
    const [protocols, setProtocols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = React.useState(null);

    const handleDelete = (protocol) => () => {
        setSelectedProtocol(protocol);
        setOpenDelete(true);
    }


    function getData() {
        AxiosInstance.get("all_protocols")
            .then((response) => {
                setProtocols(response.data);
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
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" component="div">Все протоколы</Typography>
                <Button size="small" href={"/admin/create_protocol"}>Добавить</Button>
            </Box>
            {
                loading
                    ? <Waiting/>
                    : <>
                        {protocols.length === 0
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
                                        {protocols.map((protocol, index) => (
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
                                                    <Tooltip title="Удалить">
                                                        <IconButton
                                                            sx={{marginLeft: '5px'}}
                                                            edge="end"
                                                            variant="contained"
                                                            onClick={handleDelete(protocol)}
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
                        {
                            openDelete &&
                            <DeleteProtocol protocol={selectedProtocol} open={openDelete} setOpen={setOpenDelete}
                                            updateData={getData}/>
                        }
                    </>
            }
        </Container>
    );
}