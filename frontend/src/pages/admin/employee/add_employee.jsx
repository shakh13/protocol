import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import MyMultiSelectField from "../../../components/forms/MyMultiSelectField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useState, useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import AxiosInstance from "../../../components/axios_instance.jsx";
import Waiting from "../../../components/Waiting.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

export default function AddEmployee(props) {
    const {open, setOpen, updateData} = props;
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    function getData() {
        setLoading(true);
        AxiosInstance.get("positions/")
            .then((response) => {
                let pos = [];
                response.data.map((position) => {
                    pos.push({
                        value: position.id,
                        label: position.name,
                    })
                })
                setPositions(pos);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            })
    }

    useEffect(() => {
        getData();
    }, []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup.object({
        first_name: yup.string().required('Введите имя').min(3, 'Минимум 3 букв'),
        last_name: yup.string().required('Введите фамилию').min(3, 'Минимум 3 букв'),
        email: yup.string().email('Введите правильный Email').required('Введите Email'),
        password: yup.string()
            .min(6, 'Пароль должен содержить минимум 6 символов')
            .required('Введите пароль'),
        position: yup.object().required('Выберите должность'),
    });

    const {control, handleSubmit} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (data) => {
        AxiosInstance.post("register/", {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            username: data.email,
            password: data.password,
            position: data.position.value,
        })
            .then((response) => {
                updateData();
                window.location.href = '/admin/employee/' + response.data.id;
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
                setOpen(false);
            });
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-describedby="scroll-dialog-description"
            aria-labelledby="responsive-dialog-title"
        >
            <Container maxWidth="sm" sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                {loading
                    ? <Waiting/>
                    : <>
                        <DialogTitle id="responsive-dialog-title">
                            {"Добавить сотрудника"}
                        </DialogTitle>

                        <form onSubmit={handleSubmit(onSubmit)}
                              style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <DialogContent>
                                <MyTextField name="first_name" label="Имя" type="text" control={control}/>
                                <MyTextField name="last_name" label="Фамилия" type="text" control={control}/>
                                <MyTextField name="email" label="Email" type="email" control={control}/>
                                <MyTextField name="password" label="Пароль" type="password" control={control}/>

                                <MySelectField name={"position"} label={"Должность"} options={positions}
                                               control={control}/>
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
                    </>
                }
            </Container>
        </Dialog>
    );
}