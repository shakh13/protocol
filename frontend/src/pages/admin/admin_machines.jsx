import {Container, IconButton, List, ListItem, ListItemText, Skeleton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import * as React from "react";
import AddMachine from "./machines/add_machine.jsx";
import EditMachine from "./machines/edit_machine.jsx";
import DeleteMachine from "./machines/delete_machine.jsx";
import AxiosInstance from "../../components/axios_instance.jsx";
import dayjs from "dayjs";
import NoData from "../../components/NoData.jsx";
import Waiting from "../../components/Waiting.jsx";
import Swal from "sweetalert2";


export default function AdminMachines() {
    const [addMachineOpen, setAddMachineOpen] = useState(false);
    const [editMachineOpen, setEditMachineOpen] = useState(false);
    const [editMachineId, setEditMachineId] = useState(0);
    const [deleteMachineOpen, setDeleteMachineOpen] = useState(false);
    const [deleteMachineId, setDeleteMachineId] = useState(0);
    const [machines, setMachines] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");

    function getData() {
        setLoading(true);
        AxiosInstance.get("machines/")
            .then((response) => {
                setMachines(response.data);
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

    const handleAddMachineOpen = () => {
        setAddMachineOpen(true);
    };

    const handleEditMachineOpen = (id) => () => {
        setEditMachineId(id);
        setEditMachineOpen(true);
    }

    const handleDeleteMachineOpen = (id) => () => {
        setDeleteMachineId(id);
        setDeleteMachineOpen(true);
    }

    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Оборудование</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddMachineOpen}
                    >
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <TextField
                    id="search_machines_field"
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
                loading ?
                    <Waiting/>
                    :
                    <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                        {machines.length === 0 && <NoData/>}
                        {
                            machines
                                .filter((machine) => machine.name.toLowerCase().search(searchFilter.toLowerCase()) > -1)
                                .map((machine) =>
                                    <ListItem alignItems="flex-start"
                                              key={"machine_" + machine.id}
                                              secondaryAction={
                                                  <>
                                                      <Tooltip title="Редактировать">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Редактировать"
                                                              onClick={handleEditMachineOpen(machine.id)}
                                                          >
                                                              <EditIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                      <Tooltip title="Удалить">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Удалить"
                                                              sx={{marginLeft: '15px'}}
                                                              onClick={handleDeleteMachineOpen(machine.id)}
                                                          >
                                                              <DeleteIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                  </>
                                              }
                                    >
                                        <ListItemText
                                            primary={machine.name}
                                            secondary={machine.certificate.name + ": " + machine.certificate_number + " - " + dayjs(machine.certificate_expiry_date).format("DD.MM.YYYY")}
                                        />

                                        <Divider variant="inset" component="div"/>
                                    </ListItem>)
                        }
                    </List>
            }
            {addMachineOpen &&
                <AddMachine open={addMachineOpen} setOpen={setAddMachineOpen} updateData={getData}/>}
            {editMachineOpen &&
                <EditMachine open={editMachineOpen} setOpen={setEditMachineOpen} id={editMachineId}
                             updateData={getData}/>}
            {deleteMachineOpen &&
                <DeleteMachine open={deleteMachineOpen} setOpen={setDeleteMachineOpen} id={deleteMachineId}
                               updateData={getData}/>}
        </Container>
    );
}