import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary, Card, CardActions, CardContent, CardHeader,
    Container,
    IconButton,
    List,
    ListItem, ListItemAvatar, ListItemText,
    Tooltip
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import Waiting from "../../components/Waiting.jsx";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import EditEmployee from "./employee/edit_employee.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MySearchField from "../../components/forms/MySearchField.jsx";
import NoData from "../../components/NoData.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AddBuilding from "./buildings/add_building.jsx";
import EditBuilding from "./buildings/edit_building.jsx";
import DeleteBuilding from "./buildings/delete_building.jsx";
import AddEmployeeBuilding from "./employee/add_employee_building.jsx";

export default function AdminEmployee() {
    const {id} = useParams();
    const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
    const [addBuildingOpen, setAddBuildingOpen] = useState(false);

    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);


    function getData() {
        setLoading(true);
        AxiosInstance.get("users/" + id + "/")
            .then((response) => {
                setLoading(false);
                setEmployee(response.data);
            })
            .catch((error) => {
                setLoading(true);
                console.log(error);
            });
    }

    const handleAddBuildingOpen = () => {
        setAddBuildingOpen(true);
    }

    const handleEditEmployeeOpen = () => {
        setEditEmployeeOpen(true);
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            {loading
                ? <Waiting/>
                : <>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        <Typography variant="h6" component="div"
                                    sx={{padding: '0 10px', marginY: 'auto'}}>Сотрудник
                            ({employee.fullname})</Typography>
                        <Tooltip title="Изменить">
                            <IconButton
                                variant="outlined"
                                onClick={handleEditEmployeeOpen}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        {editEmployeeOpen &&
                            <EditEmployee open={editEmployeeOpen} setOpen={setEditEmployeeOpen} id={id}
                                          updateData={getData}/>
                        }
                    </Box>

                    <Card>
                        <CardContent>
                            <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                                Все объекты
                            </Typography>
                            <List sx={{width: '100%', minWidth: 360, bgcolor: 'transparent'}}>
                                {employee.buildings.length === 0 && <NoData/>}
                                {
                                    employee.buildings
                                        .map((building) => (
                                            <ListItem alignItems="flex-start"
                                                      key={"building_"}
                                                // sx={{padding: "8px 0"}}
                                                      secondaryAction={
                                                          <Tooltip title="Удалить">
                                                              <IconButton
                                                                  edge="end"
                                                                  aria-label="Удалить"
                                                                  sx={{marginLeft: '15px'}}
                                                                  // onClick={handleDeleteBuildingOpen(building.id)}
                                                              >
                                                                  <DeleteIcon/>
                                                              </IconButton>
                                                          </Tooltip>
                                                      }
                                            >
                                                <ListItemAvatar sx={{marginY: 'auto'}}>
                                                    <Typography component="div">1</Typography>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={(
                                                        <Link href={"/admin/building/"} underline="none">
                                                            {building.name}
                                                        </Link>
                                                    )}
                                                    secondary={"building address"}
                                                />
                                                <Divider variant="inset" component="div"/>
                                            </ListItem>
                                        ))
                                }
                            </List>

                            {addBuildingOpen &&
                                <AddEmployeeBuilding
                                    open={addBuildingOpen}
                                    setOpen={setAddBuildingOpen}
                                    employee={id}
                                    updateData={getData}
                                />
                            }
                            {/*{deleteBuildingOpen &&*/}
                            {/*    <DeleteBuilding*/}
                            {/*        open={deleteBuildingOpen}*/}
                            {/*        setOpen={setDeleteBuildingOpen}*/}
                            {/*        id={deleteBuildingId}*/}
                            {/*        updateData={getData}*/}
                            {/*    />*/}
                            {/*}*/}
                        </CardContent>
                        <CardActions
                            disableSpacing
                            sx={{
                                alignSelf: "stretch",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-start",
                                p: 1,
                            }}
                        >
                            <Button size="small" onClick={handleAddBuildingOpen}>Добавить</Button>
                        </CardActions>
                    </Card>

                </>
            }
        </Container>
    );
}