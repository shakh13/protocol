import {Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {cloneElement, useEffect, useState} from "react";
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
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import NoData from "../../components/NoData.jsx";
import Swal from "sweetalert2";

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
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);

    function getData() {
        setLoading(true);
        AxiosInstance.get("positions/")
            .then((response) => {
                setPositions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    useEffect(() => {
        getData();
    }, []);

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
            {
                loading
                    ? <Waiting/>
                    : <>
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
                            {positions.length === 0 && <NoData/>}
                            {
                                positions.map((position) => (
                                    <ListItem alignItems="flex-start"
                                              key={"position_" + position.id}
                                              sx={{padding: "8px 0"}}
                                              secondaryAction={
                                                  <>
                                                      <Tooltip title="Редактировать">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Редактировать"
                                                              onClick={handleEditPositionOpen(position.id)}
                                                          >
                                                              <EditIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                      <Tooltip title="Удалить">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Удалить"
                                                              sx={{marginLeft: '15px'}}
                                                              onClick={handleDeletePositionOpen(position.id)}
                                                          >
                                                              <DeleteIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                  </>
                                              }
                                    >
                                        <ListItemAvatar sx={{marginY: 'auto'}}>
                                            <Typography component="div">{position.id}</Typography>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={position.name}
                                        />

                                        <Divider variant="inset" component="div"/>
                                    </ListItem>
                                ))
                            }
                        </List>
                        {addPositionOpen &&
                            <AddPosition
                                open={addPositionOpen}
                                setOpen={setAddPositionOpen}
                                updateData={getData}
                            />
                        }
                        {editPositionOpen &&
                            <EditPosition
                                open={editPositionOpen}
                                setOpen={setEditPositionOpen}
                                id={editPositionId}
                                updateData={getData}
                            />
                        }
                        {deletePositionOpen &&
                            <DeletePosition
                                open={deletePositionOpen}
                                setOpen={setDeletePositionOpen}
                                id={deletePositionId}
                                updateData={getData}
                            />
                        }
                    </>
            }
        </Container>
    )
}