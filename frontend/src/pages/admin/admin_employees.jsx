import * as React from 'react';
import {useState, Fragment, cloneElement} from "react";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import {
    Avatar, Container,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Tooltip,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import AddEmployee from "./employee/add_employee.jsx";
import EditEmployee from "./employee/edit_employee.jsx";
import DeleteEmployee from "./employee/delete_employee.jsx";
import Link from "@mui/material/Link";


function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}


export default function AdminEmployees() {
    const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
    const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
    const [editEmployeeId, setEditEmployeeId] = useState(0);
    const [deleteEmployeeOpen, setDeleteEmployeeOpen] = useState(false);
    const [deleteEmployeeId, setDeleteEmployeeId] = useState(0);

    const handleAddEmployeeOpen = () => {
        setAddEmployeeOpen(true);
    };

    const handleEditEmployeeOpen = (id) => () => {
        setEditEmployeeId(id);
        setEditEmployeeOpen(true);
    }

    const handleDeleteEmployeeOpen = (id) => () => {
        setDeleteEmployeeId(id);
        setDeleteEmployeeOpen(true);
    }

    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Сотрудники</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddEmployeeOpen}
                    >
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <TextField
                    id="search_employees_field"
                    label="Поиск"
                    variant="outlined"
                    size="small"
                    sx={{
                        minWidth: '100px',
                        width: '300px',
                        margin: 'auto 0 auto auto',
                    }}
                />
            </Box>
            <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                {generate(
                    <>
                        <ListItem alignItems="flex-start"
                                  secondaryAction={
                                      <>
                                          <Tooltip title="Редактировать">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Редактировать"
                                                  onClick={handleEditEmployeeOpen(2)}
                                              >
                                                  <EditIcon/>
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Удалить">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Удалить"
                                                  sx={{marginLeft: '15px'}}
                                                  onClick={handleDeleteEmployeeOpen(2)}
                                              >
                                                  <DeleteIcon/>
                                              </IconButton>
                                          </Tooltip>
                                      </>
                                  }
                        >
                            <ListItemAvatar>
                                <Avatar>S</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={(<Link href="/admin/employee/1" underline="none">Shaxzod Saidmurodov</Link>)}
                                secondary="vip.shaxi@gmail.com"
                            />
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </>
                )}
            </List>
            <AddEmployee open={addEmployeeOpen} setOpen={setAddEmployeeOpen}/>
            <EditEmployee open={editEmployeeOpen} setOpen={setEditEmployeeOpen} id={editEmployeeId}/>
            <DeleteEmployee open={deleteEmployeeOpen} setOpen={setDeleteEmployeeOpen} id={deleteEmployeeId}/>
        </Container>
    );
}