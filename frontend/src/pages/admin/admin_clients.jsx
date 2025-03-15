import {Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {cloneElement, useState} from "react";
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

function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}

export default function AdminClients() {
    const [addClientOpen, setAddClientOpen] = useState(false);
    const [editClientOpen, setEditClientOpen] = useState(false);
    const [editClientId, setEditClientId] = useState(0);
    const [deleteClientId, setDeleteClientId] = useState(0);
    const [deleteClientOpen, setDeleteClientOpen] = useState(false);

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
                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Заказчики</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddClientOpen}
                    >
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
            </Box>
            <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                {generate(
                    <>
                        <ListItem alignItems="flex-start"
                                  sx={{padding: "8px 0"}}
                                  secondaryAction={
                                      <>
                                          <Tooltip title="Редактировать">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Редактировать"
                                                  onClick={handleEditClientOpen(2)}
                                              >
                                                  <EditIcon/>
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Удалить">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Удалить"
                                                  sx={{marginLeft: '15px'}}
                                                  onClick={handleDeleteClientOpen(2)}
                                              >
                                                  <DeleteIcon/>
                                              </IconButton>
                                          </Tooltip>
                                      </>
                                  }
                        >
                            <ListItemAvatar sx={{marginY: 'auto'}}>
                                <Typography component="div">12</Typography>
                            </ListItemAvatar>
                            <ListItemText
                                primary={(<Link href="/admin/client/1" underline="none">Название клиента</Link>)}
                                secondary="Адрес"
                            />
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </>
                )}
            </List>
            <AddClient open={addClientOpen} setOpen={setAddClientOpen}/>
            <EditClient open={editClientOpen} setOpen={setEditClientOpen} id={editClientId}/>
            <DeleteClient open={deleteClientOpen} setOpen={setDeleteClientOpen} id={deleteClientId}/>
        </Container>
    )
}