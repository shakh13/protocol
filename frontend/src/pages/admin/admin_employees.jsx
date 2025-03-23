import * as React from 'react';
import {useState, Fragment, cloneElement, useEffect} from "react";
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
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import NoData from "../../components/NoData.jsx";
import MySearchField from "../../components/forms/MySearchField.jsx";
import MyAvatar from "../../components/MyAvatar.jsx";


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
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");

    function getData() {
        setLoading(true);
        AxiosInstance.get("users/")
            .then((response) => {
                setEmployees(response.data);
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
            {loading
                ? <Waiting/>
                : <>
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
                        <MySearchField name={"employees"} setSearchFilter={setSearchFilter}/>
                    </Box>

                    <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                        {employees.length === 0 && <NoData/>}
                        {
                            employees
                                .filter((employee) => employee.fullname.toLowerCase().search(searchFilter.toLowerCase()) > -1)
                                .map(employee => (
                                    <ListItem alignItems="flex-start"
                                              key={"employees_" + employee.id}
                                              secondaryAction={
                                                  <>
                                                      <Tooltip title="Редактировать">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Редактировать"
                                                              onClick={handleEditEmployeeOpen(employee.id)}
                                                          >
                                                              <EditIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                      <Tooltip title="Удалить">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Удалить"
                                                              sx={{marginLeft: '15px'}}
                                                              onClick={handleDeleteEmployeeOpen(employee.id)}
                                                          >
                                                              <DeleteIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                  </>
                                              }
                                    >
                                        <ListItemAvatar>
                                            <MyAvatar fullname={employee.fullname}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={(
                                                <Link href={"/admin/employee/" + employee.id} underline="none">
                                                    {employee.fullname}
                                                </Link>
                                            )}
                                            secondary={employee.email + " - " + employee.position.name}
                                        />

                                        <Divider variant="inset" component="div"/>
                                    </ListItem>
                                ))
                        }
                    </List>

                    {addEmployeeOpen &&
                        <AddEmployee open={addEmployeeOpen} setOpen={setAddEmployeeOpen} updateData={getData}/>
                    }
                    {editEmployeeOpen &&
                        <EditEmployee open={editEmployeeOpen} setOpen={setEditEmployeeOpen} id={editEmployeeId}
                                      updateData={getData}/>
                    }
                    {deleteEmployeeOpen &&
                        <DeleteEmployee open={deleteEmployeeOpen} setOpen={setDeleteEmployeeOpen} id={deleteEmployeeId}
                                        updateData={getData}/>
                    }
                </>
            }
        </Container>
    );
}