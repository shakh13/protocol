import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary, Card, CardActions, CardContent, CardHeader,
    Container,
    IconButton,
    List,
    ListItem, ListItemAvatar, ListItemText,
    Tooltip
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import EditEmployee from "./employee/edit_employee.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MySearchField from "../../components/forms/MySearchField.jsx";
import NoData from "../../components/NoData.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AddBuilding from "./buildings/add_building.jsx";
import EditBuilding from "./buildings/edit_building.jsx";
import DeleteBuilding from "./buildings/delete_building.jsx";
import AddEmployeeBuilding from "./employee/add_employee_building.jsx";
import DeleteEmployeeBuilding from "./employee/delete_employee_building.jsx";
import AddEmployeeClient from "./employee/add_employee_client.jsx";
import DeleteEmployeeClient from "./employee/delete_employee_client.jsx";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Close, Done} from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import DeleteProtocol from "../personal/protocol/delete_protocol.jsx";
import Swal from "sweetalert2";

export default function AdminEmployee() {
    const {id} = useParams();
    const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
    const [addBuildingOpen, setAddBuildingOpen] = useState(false);
    const [addClientOpen, setAddClientOpen] = useState(false);
    const [deleteBuildingOpen, setDeleteBuildingOpen] = useState(false);
    const [deleteClientOpen, setDeleteClientOpen] = useState(false);
    const [deleteBuildingId, setDeleteBuildingId] = useState(0);
    const [deleteClientId, setDeleteClientId] = useState(0);

    const [employee, setEmployee] = useState({});
    const [protocols, setProtocols] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = React.useState(null);

    const handleDelete = (protocol) => () => {
        setSelectedProtocol(protocol);
        setOpenDelete(true);
    }


    function getData() {
        setLoading(true);
        AxiosInstance.get("users/" + id + "/")
            .then((response) => {
                setEmployee(response.data);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });

        AxiosInstance.get(`user_protocols/${id}`)
            .then((response) => {
                setProtocols(response.data);
                setLoading(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            })
    }

    const handleAddClientOpen = () => {
        setAddClientOpen(true);
    }

    const handleAddBuildingOpen = () => {
        setAddBuildingOpen(true);
    }

    const handleDeleteClientOpen = (id) => () => {
        setDeleteClientId(id);
        setDeleteClientOpen(true);
    }

    const handleDeleteBuildingOpen = (id) => () => {
        setDeleteBuildingId(id);
        setDeleteBuildingOpen(true);
    }

    const handleEditEmployeeOpen = () => {
        setEditEmployeeOpen(true);
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            {loading
                ? <Waiting/>
                : <>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        <Typography variant="h6" component="div"
                                    sx={{padding: '0 10px', marginY: 'auto'}}>Сотрудник
                            ({employee.fullname})</Typography>
                        <Tooltip title="Изменить">
                            <IconButton
                                variant="outlined"
                                onClick={handleEditEmployeeOpen}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        {editEmployeeOpen &&
                            <EditEmployee open={editEmployeeOpen} setOpen={setEditEmployeeOpen} id={id}
                                          updateData={getData}/>
                        }
                    </Box>

                    <Card sx={{marginTop: "15px"}}>
                        <CardContent>
                            <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 16}}>
                                Объекты
                            </Typography>
                            <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
                                {!employee.buildings ? <NoData/> :
                                    employee?.buildings
                                        .map((building) => (
                                            <ListItem alignItems="flex-start"
                                                      key={"building_" + building.id}
                                                // sx={{padding: "8px 0"}}
                                                      secondaryAction={
                                                          <Tooltip title="Удалить">
                                                              <IconButton
                                                                  edge="end"
                                                                  aria-label="Удалить"
                                                                  sx={{marginLeft: '15px'}}
                                                                  onClick={handleDeleteBuildingOpen(building.id)}
                                                              >
                                                                  <DeleteIcon/>
                                                              </IconButton>
                                                          </Tooltip>
                                                      }
                                            >
                                                <ListItemAvatar sx={{marginY: 'auto'}}>
                                                    <Typography component="div">{building.id}</Typography>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={(
                                                        <Link href={"/admin/building/" + building.id} underline="none">
                                                            {building.name}
                                                        </Link>
                                                    )}
                                                    secondary={building.address}
                                                />
                                                <Divider variant="inset" component="div"/>
                                            </ListItem>
                                        ))
                                }
                            </List>

                            {addBuildingOpen &&
                                <AddEmployeeBuilding
                                    open={addBuildingOpen}
                                    setOpen={setAddBuildingOpen}
                                    employee={id}
                                    updateData={getData}
                                />
                            }
                            {deleteBuildingOpen &&
                                <DeleteEmployeeBuilding
                                    open={deleteBuildingOpen}
                                    setOpen={setDeleteBuildingOpen}
                                    id={deleteBuildingId}
                                    updateData={getData}
                                />
                            }
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                alignSelf: "stretch",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-start",
                                p: 1,
                            }}
                        >
                            <Button size="small" onClick={handleAddBuildingOpen}>Добавить</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{marginTop: "15px"}}>
                        <CardContent>
                            <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 16}}>
                                Заказчики
                            </Typography>
                            <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
                                {!employee.clients ? <NoData/> :

                                    employee.clients
                                        .map((client) => (
                                            <ListItem alignItems="flex-start"
                                                      key={"client_" + client.id}
                                                      secondaryAction={
                                                          <Tooltip title="Удалить">
                                                              <IconButton
                                                                  edge="end"
                                                                  aria-label="Удалить"
                                                                  sx={{marginLeft: '15px'}}
                                                                  onClick={handleDeleteClientOpen(client.id)}
                                                              >
                                                                  <DeleteIcon/>
                                                              </IconButton>
                                                          </Tooltip>
                                                      }
                                            >
                                                <ListItemAvatar sx={{marginY: 'auto'}}>
                                                    <Typography component="div">{client.id}</Typography>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={(
                                                        <Link href={"/admin/client/" + client.id} underline="none">
                                                            {client.name}
                                                        </Link>
                                                    )}
                                                    secondary={client.address}
                                                />
                                                <Divider variant="inset" component="div"/>
                                            </ListItem>
                                        ))
                                }
                            </List>

                            {addClientOpen &&
                                <AddEmployeeClient
                                    open={addClientOpen}
                                    setOpen={setAddClientOpen}
                                    employee={id}
                                    updateData={getData}
                                />
                            }
                            {deleteClientOpen &&
                                <DeleteEmployeeClient
                                    open={deleteClientOpen}
                                    setOpen={setDeleteClientOpen}
                                    employee={id}
                                    id={deleteClientId}
                                    updateData={getData}
                                />
                            }
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                alignSelf: "stretch",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-start",
                                p: 1,
                            }}
                        >
                            <Button size="small" onClick={handleAddClientOpen}>Добавить</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{marginTop: "15px"}}>
                        <CardContent>
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


                            {addClientOpen &&
                                <AddEmployeeClient
                                    open={addClientOpen}
                                    setOpen={setAddClientOpen}
                                    employee={id}
                                    updateData={getData}
                                />
                            }
                            {deleteClientOpen &&
                                <DeleteEmployeeClient
                                    open={deleteClientOpen}
                                    setOpen={setDeleteClientOpen}
                                    employee={id}
                                    id={deleteClientId}
                                    updateData={getData}
                                />
                            }
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                alignSelf: "stretch",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-start",
                                p: 1,
                            }}
                        >
                            <Button size="small" href={"/admin/create_protocol"}>Добавить</Button>
                        </CardActions>
                    </Card>
                </>
            }
        </Container>
    );
}