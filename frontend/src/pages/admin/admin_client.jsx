import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Container, IconButton, List,
    ListItem, ListItemAvatar, ListItemText,
    Tooltip
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {cloneElement, useState} from "react";
import {useParams} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import * as React from "react";
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

export default function AdminClient() {
    const {id} = useParams();

    const [addBuildingOpen, setAddBuildingOpen] = useState(false);
    const [editBuildingOpen, setEditBuildingOpen] = useState(false);
    const [deleteBuildingOpen, setDeleteBuildingOpen] = useState(false);
    const [editBuildingId, setEditBuildingId] = useState(0);
    const [deleteBuildingId, setDeleteBuildingId] = useState(0);

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
            <Typography variant="h6" component="div">Заказчик #{id}</Typography>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography component="span">Объекты</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
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
                                        <Typography component="div">13</Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={(
                                            <Link href="/admin/building/1" underline="none">Название объекта</Link>)}
                                        secondary="Адрес"
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </>
                        )}
                    </List>
                </AccordionDetails>
                <AccordionActions>
                    <Button onClick={handleAddBuildingOpen}>Добавить</Button>
                </AccordionActions>
            </Accordion>
            <AddBuilding open={addBuildingOpen} setOpen={setAddBuildingOpen}/>
            <EditBuilding open={editBuildingOpen} setOpen={setEditBuildingOpen} id={editBuildingId}/>
            <DeleteBuilding open={deleteBuildingOpen} setOpen={setDeleteBuildingOpen} id={deleteBuildingId}/>

            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography component="span">Протоколы</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
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
                                                      >
                                                          <EditIcon/>
                                                      </IconButton>
                                                  </Tooltip>
                                                  <Tooltip title="Удалить">
                                                      <IconButton
                                                          edge="end"
                                                          aria-label="Удалить"
                                                          sx={{marginLeft: '15px'}}
                                                      >
                                                          <DeleteIcon/>
                                                      </IconButton>
                                                  </Tooltip>
                                              </>
                                          }
                                >
                                    <ListItemAvatar sx={{marginY: 'auto'}}>
                                        <Typography component="div">13</Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={(
                                            <Link href="/admin/client/1" underline="none">Название объекта</Link>)}
                                        secondary="Адрес"
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </>
                        )}
                    </List>
                </AccordionDetails>
                <AccordionActions>
                    <Button>Добавить</Button>
                </AccordionActions>
            </Accordion>
        </Container>
    )
}