import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useState, useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import AxiosInstance from "../../../components/axios_instance.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Waiting from "../../../components/Waiting.jsx";
import Swal from "sweetalert2";


export default function EditBuilding(props) {
    const {open, setOpen, id, updateData} = props;
    const [loading, setLoading] = useState(true);


    function getData() {
        setLoading(true);

        AxiosInstance.get("buildings/" + id + "/")
            .then((response) => {
                setValue('name', response.data.name);
                setValue('prefix', response.data.prefix);
                setLoading(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
                setLoading(true);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup.object({
        name: yup.string().required('Введите название объекта'),
        prefix: yup.string().min(1, 'Введите не менее 1 символ').required('Введите префикс для объекта'),
    });

    const {control, handleSubmit, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            prefix: '',
        },
    });

    const onSubmit = (data) => {
        AxiosInstance.put("buildings/" + id + "/", {
            name: data.name,
            prefix: data.prefix,
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
                setOpen(false);
            })
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
                {
                    loading
                        ? <Waiting/>
                        : <>
                            <DialogTitle id="responsive-dialog-title">
                                {"Редактировать объект"}
                            </DialogTitle>

                            <form onSubmit={handleSubmit(onSubmit)}
                                  style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <DialogContent>
                                    <MyTextField name="name" label="Название" type="text" control={control}/>
                                    <MyTextField name="prefix" label="Префикс" type="address" control={control}/>
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