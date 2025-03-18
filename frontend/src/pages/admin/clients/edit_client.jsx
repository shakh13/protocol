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
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import AxiosInstance from "../../../components/axios_instance.jsx";
import dayjs from "dayjs";
import ErrorMessage from "../../../components/ErrorMessage.jsx";


export default function EditClient(props) {
    const {open, setOpen, id, updateData} = props;
    const [loading, setLoading] = useState(true);
    const [editError, setEditError] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    function getData() {
        setLoading(true);
        AxiosInstance.get("clients/" + id + "/")
            .then((response) => {
                setValue('name', response.data.name);
                setValue('address', response.data.address);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(true);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const schema = yup
        .object({
            name: yup.string().required('Введите название заказчика'),
            address: yup.string().required('Введите адрес'),
        });

    const {control, handleSubmit, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            address: '',
        },
    });

    const onSubmit = (data) => {
        setEditError(false);
        AxiosInstance.put("clients/" + id + "/", {
            name: data.name,
            address: data.address,
        })
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                setEditError(true);
                console.log(error);
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
                <DialogTitle id="responsive-dialog-title">
                    {"Редактировать заказчик"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}
                      style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <DialogContent>
                        <MyTextField name="name" label="Название" type="text" control={control}/>
                        <MyTextField name="address" label="Адрес" type="text" control={control}/>
                        {editError &&
                            <ErrorMessage message={"Ошибка редактирования"}/>
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