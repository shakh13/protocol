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
import AddBuilding from "./client/add_building.jsx";
import EditBuilding from "./client/edit_building.jsx";
import DeleteBuilding from "./client/delete_building.jsx";

function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}

export default function AdminBuildings() {
    const [addBuildingOpen, setAddBuildingOpen] = useState(false);
    const [editBuildingOpen, setEditBuildingOpen] = useState(false);
    const [editBuildingId, setEditBuildingId] = useState(0);
    const [deleteBuildingId, setDeleteBuildingId] = useState(0);
    const [deleteBuildingOpen, setDeleteBuildingOpen] = useState(false);

    const handleAddBuildingOpen = () => {
        setAddBuildingOpen(true);
    }

    const handleEditBuildingOpen = (id) => () => {
        setEditBuildingId(id);
        setEditBuildingOpen(true);
    }

    const handleDeleteBuildingOpen = (id) => () => {
        setDeleteBuildingId(id);
        setDeleteBuildingOpen(true);
    }
    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Объекты</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddBuildingOpen}
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
                                                  onClick={handleEditBuildingOpen(2)}
                                              >
                                                  <EditIcon/>
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Удалить">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Удалить"
                                                  sx={{marginLeft: '15px'}}
                                                  onClick={handleDeleteBuildingOpen(2)}
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
                                primary={(<Link href="/admin/building/1" underline="none">Название клиента</Link>)}
                                secondary="Адрес"
                            />
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </>
                )}
            </List>
            <AddBuilding open={addBuildingOpen} setOpen={setAddBuildingOpen}/>
            <EditBuilding open={editBuildingOpen} setOpen={setEditBuildingOpen} id={editBuildingId}/>
            <DeleteBuilding open={deleteBuildingOpen} setOpen={setDeleteBuildingOpen} id={deleteBuildingId}/>
        </Container>
    )
}