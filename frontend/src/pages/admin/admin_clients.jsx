import {Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Divider from "@mui/material/Divider";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import AddClient from "./clients/add_client.jsx";
import DeleteClient from "./clients/delete_client.jsx";
import EditClient from "./clients/edit_client.jsx";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import TextField from "@mui/material/TextField";
import NoData from "../../components/NoData.jsx";


export default function AdminClients() {
    const [addClientOpen, setAddClientOpen] = useState(false);
    const [editClientOpen, setEditClientOpen] = useState(false);
    const [editClientId, setEditClientId] = useState(0);
    const [deleteClientId, setDeleteClientId] = useState(0);
    const [deleteClientOpen, setDeleteClientOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");


    function getData() {
        setLoading(true);
        AxiosInstance.get("clients/")
            .then((response) => {
                setClients(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const handleAddClientOpen = () => {
        setAddClientOpen(true);
    }

    const handleEditClientOpen = (id) => () => {
        setEditClientId(id);
        setEditClientOpen(true);
    }

    const handleDeleteClientOpen = (id) => () => {
        setDeleteClientId(id);
        setDeleteClientOpen(true);
    }
    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{padding: '0 10px', marginY: 'auto'}}
                >
                    Заказчики
                </Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddClientOpen}
                    >
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <TextField
                    id="search_clients_field"
                    label="Поиск"
                    variant="outlined"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: '100px',
                        width: '300px',
                        margin: 'auto 0 auto auto',
                    }}
                />
            </Box>
            {
                loading
                    ? <Waiting/>
                    : <>
                        <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                            {clients.length === 0 && <NoData/>}
                            {
                                clients
                                    .filter((client) => client.name.toLowerCase().search(searchFilter.toLowerCase()) > -1)
                                    .map((client) => (
                                        <ListItem alignItems="flex-start"
                                                  key={"client_" + client.id}
                                                  sx={{padding: "8px 0"}}
                                                  secondaryAction={
                                                      <>
                                                          <Tooltip title="Редактировать">
                                                              <IconButton
                                                                  edge="end"
                                                                  aria-label="Редактировать"
                                                                  onClick={handleEditClientOpen(client.id)}
                                                              >
                                                                  <EditIcon/>
                                                              </IconButton>
                                                          </Tooltip>
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
                                                      </>
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

                                            <Divider/>
                                        </ListItem>
                                    ))
                            }
                        </List>
                        {
                            addClientOpen &&
                            <AddClient
                                open={addClientOpen}
                                setOpen={setAddClientOpen}
                                updateData={getData}
                            />
                        }
                        {
                            editClientOpen &&
                            <EditClient
                                open={editClientOpen}
                                setOpen={setEditClientOpen}
                                id={editClientId}
                                updateData={getData}
                            />
                        }
                        {
                            deleteClientOpen &&
                            <DeleteClient
                                open={deleteClientOpen}
                                setOpen={setDeleteClientOpen}
                                id={deleteClientId}
                                updateData={getData}
                            />
                        }
                    </>
            }
        </Container>
    )
}