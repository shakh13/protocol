import {Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {cloneElement, useState} from "react";
import {Close, Delete, Done, Edit} from "@mui/icons-material";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AddPosition from "./position/add_position.jsx";
import EditPosition from "./position/edit_position.jsx";
import DeletePosition from "./position/delete_position.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}

export default function AdminPositions() {
    const [addPositionOpen, setAddPositionOpen] = useState(false);
    const [editPositionOpen, setEditPositionOpen] = useState(false);
    const [editPositionId, setEditPositionId] = useState(0);
    const [deletePositionId, setDeletePositionId] = useState(0);
    const [deletePositionOpen, setDeletePositionOpen] = useState(false);

    const handleAddPositionOpen = () => {
        setAddPositionOpen(true);
    }

    const handleEditPositionOpen = (id) => () => {
        setEditPositionId(id);
        setEditPositionOpen(true);
    }

    const handleDeletePositionOpen = (id) => () => {
        setDeletePositionId(id);
        setDeletePositionOpen(true);
    }
    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Должности</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddPositionOpen}
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
                                                  onClick={handleEditPositionOpen(2)}
                                              >
                                                  <EditIcon/>
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Удалить">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Удалить"
                                                  sx={{marginLeft: '15px'}}
                                                  onClick={handleDeletePositionOpen(2)}
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
                                primary="Название должности"
                            />
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </>
                )}
            </List>
            <AddPosition open={addPositionOpen} setOpen={setAddPositionOpen}/>
            <EditPosition open={editPositionOpen} setOpen={setEditPositionOpen} id={editPositionId}/>
            <DeletePosition open={deletePositionOpen} setOpen={setDeletePositionOpen} id={deletePositionId}/>
        </Container>
    )
}