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
import {cloneElement, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import * as React from "react";
import AddBuilding from "./buildings/add_building.jsx";
import EditBuilding from "./buildings/edit_building.jsx";
import DeleteBuilding from "./buildings/delete_building.jsx";
import MySearchField from "../../components/forms/MySearchField.jsx";
import Box from "@mui/material/Box";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import NoData from "../../components/NoData.jsx";
import Fade from '@mui/material/Fade';
import EditClient from "./clients/edit_client.jsx";
import DeleteClient from "./clients/delete_client.jsx";

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
    const [buildingSearchFilter, setBuildingSearchFilter] = useState("");
    const [protocolSearchFilter, setProtocolSearchFilter] = useState("");
    const [client, setClient] = useState({});
    const [loading, setLoading] = useState(true);
    const [editClientOpen, setEditClientOpen] = useState(false);
    const [deleteClientOpen, setDeleteClientOpen] = useState(false);

    function getData() {
        setLoading(true);
        AxiosInstance.get("clients/" + id + "/")
            .then((response) => {
                setClient(response.data);
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

    const handleEditClientOpen = () => {
        setEditClientOpen(true);
    }

    const handleDeleteClientOpen = () => {
        setDeleteClientOpen(true);
    }


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
            {loading
                ? <Waiting/>
                : <>
                    <Box sx={{display: "flex", flexDirection: 'row'}}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                marginY: 'auto',
                            }}>
                            Заказчик ({client.name})
                        </Typography>
                        <Box sx={{
                            margin: 'auto 0 auto auto'
                        }}>
                            <IconButton
                                edge="end"
                                aria-label="Редактировать"
                                sx={{margin: 'auto'}}
                                onClick={handleEditClientOpen}
                            >
                                <EditIcon/>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="Удалить"
                                sx={{margin: 'auto'}}
                                onClick={handleDeleteClientOpen}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                    {editClientOpen &&
                        <EditClient open={editClientOpen} setOpen={setEditClientOpen} id={id} updateData={getData}/>}
                    {deleteClientOpen &&
                        <DeleteClient open={deleteClientOpen} setOpen={setDeleteClientOpen} id={id}
                                      updateData={getData}/>}
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Box sx={{marginY: 'auto'}}>
                                <Typography component="span">Объекты</Typography>
                            </Box>
                            <MySearchField name={"search_building_field"}
                                           setSearchFilter={setBuildingSearchFilter}/>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
                                {client.buildings.length === 0 && <NoData/>}
                                {
                                    client.buildings
                                        .filter((building) => building.name.toLowerCase().search(buildingSearchFilter.toLowerCase()) > -1)
                                        .map((building) => (
                                            <ListItem alignItems="flex-start"
                                                      key={"building_" + building.id}
                                                      sx={{padding: "8px 0"}}
                                                      secondaryAction={
                                                          <>
                                                              <Tooltip title="Редактировать">
                                                                  <IconButton
                                                                      edge="end"
                                                                      aria-label="Редактировать"
                                                                      onClick={handleEditBuildingOpen(building.id)}
                                                                  >
                                                                      <EditIcon/>
                                                                  </IconButton>
                                                              </Tooltip>
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
                                                          </>
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
                        </AccordionDetails>
                        <AccordionActions>
                            <Button onClick={handleAddBuildingOpen}>Добавить</Button>
                        </AccordionActions>
                    </Accordion>
                    {addBuildingOpen &&
                        <AddBuilding
                            open={addBuildingOpen}
                            setOpen={setAddBuildingOpen}
                            client={id}
                            updateData={getData}
                        />
                    }
                    {editBuildingOpen &&
                        <EditBuilding
                            open={editBuildingOpen}
                            setOpen={setEditBuildingOpen}
                            id={editBuildingId}
                            updateData={getData}
                        />
                    }
                    {deleteBuildingOpen &&
                        <DeleteBuilding
                            open={deleteBuildingOpen}
                            setOpen={setDeleteBuildingOpen}
                            id={deleteBuildingId}
                            updateData={getData}
                        />
                    }

                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Box sx={{marginY: 'auto'}}>
                                <Typography component="span">Все протоколы</Typography>
                            </Box>
                            <MySearchField name={"search_protocol_field"}
                                           setSearchFilter={setProtocolSearchFilter}/>
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
                                                    <Link href="/admin/client/1" underline="none">Название
                                                        объекта</Link>)}
                                                secondary="Адрес"
                                            />
                                            <Divider variant="inset" component="div"/>
                                        </ListItem>
                                    </>
                                )}
                            </List>
                        </AccordionDetails>
                        <AccordionActions>
                            <Button>Добавить</Button>
                        </AccordionActions>
                    </Accordion>
                </>
            }
        </Container>
    )
}