import Dialog from "@mui/material/Dialog";
import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import AxiosInstance from "../../../components/axios_instance.jsx";
import Waiting from "../../../components/Waiting.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import Swal from "sweetalert2";

export default function AddEmployeeBuilding(props) {
    const {employee, updateData, open, setOpen} = props;
    const [clients, setClients] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [buildingLoading, setBuildingLoading] = useState(true);

    function getData() {
        setClientsLoading(true);
        AxiosInstance.get("clients/")
            .then((response) => {
                let c = [];
                response.data.map((client) => {
                    c.push({
                        value: client.id,
                        label: client.name,
                    });
                });
                setClients(c);

                setClientsLoading(false);
            })
            .catch((error) => {
                setClientsLoading(true);
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup.object({
        client: yup.object().required('Выберите заказчика'),
        building: yup.object().required('Выберите объекта'),
    });

    const {control, handleSubmit} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {},
    });

    const onSubmit = (data) => {
        console.log(data);
        AxiosInstance.post("users/" + employee + "/add_client/", {
            client_id: data.client.value
        })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });

        AxiosInstance.put("buildings/" + data.building.value + "/", {
            user: employee,
        })
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    const onClientSelected = (selected) => {
        setBuildingLoading(true);
        AxiosInstance.get("clients/" + selected.value + "/")
            .then((response) => {
                setBuildingLoading(false);

                let b = [];
                response.data.buildings.map((building) => {
                    if (building.user === null) {
                        b.push({
                            value: building.id,
                            label: building.name,
                        });
                    }
                });

                setBuildings(b);
            })
            .catch((error) => {
                setBuildings([]);
                setBuildingLoading(false);
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-describedby="scroll-dialog-description"
            aria-labelledby="responsive-dialog-title"
        >
            <Container maxWidth="xs" sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minWidth: '500px',
            }}>
                <DialogTitle id="responsive-dialog-title">
                    {"Добавить объект"}
                </DialogTitle>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{height: '100%', display: 'flex', flexDirection: 'column'}}
                >
                    <DialogContent>
                        {clientsLoading
                            ? <Waiting/>
                            : <MySelectField
                                name={"client"}
                                label={"Заказчик"}
                                options={clients}
                                onSelected={onClientSelected}
                                control={control}
                            />
                        }
                        {buildingLoading
                            ? <Waiting/>
                            : <MySelectField
                                name={"building"}
                                label={"Объект"}
                                options={buildings}
                                control={control}
                            />

                        }
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" autoFocus type={"submit"}>
                            Сохранить
                        </Button>
                        <Button type={"button"} autoFocus onClick={handleClose}>
                            Отмена
                        </Button>
                    </DialogActions>
                </form>
            </Container>
        </Dialog>
    );
}