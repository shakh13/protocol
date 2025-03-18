import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import {useEffect, useState} from "react";
import AxiosInstance from "../../../components/axios_instance.jsx";
import dayjs from "dayjs";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Waiting from "../../../components/Waiting.jsx";
import ErrorMessage from "../../../components/ErrorMessage.jsx";

export default function EditMachine(props) {
    const {open, setOpen, id, updateData} = props;
    let certs = [];
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editError, setEditError] = useState(false);

    function getData() {
        setLoading(true);
        certs = [];
        AxiosInstance.get("certificates/").then((response) => {
            certs = [];
            response.data.map((certificate) => {
                certs.push({
                    value: certificate.id,
                    label: certificate.name,
                })
            });
            setCertificates(certs);
        }).catch((error) => {
            console.log(error);
        });

        AxiosInstance.get("machines/" + id)
            .then((response) => {
                setValue('name', response.data.name);
                setValue('certificate', certs.find((certificate) => certificate.value === response.data.certificate));
                setValue('certificate_number', response.data.certificate_number);
                setValue('certificate_expiry', dayjs(response.data.certificate_expiry_date).format('MM/DD/YYYY'));
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


    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup
        .object({
            name: yup.string().required('Заполните название оборудования'),
            certificate: yup.object().required('Выберите сертификата'),
            certificate_number: yup.string().required('Заполните номер сертификата'),
            certificate_expiry: yup.date().required('Выберите срок сертификата'),
        });

    const {control, handleSubmit, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            certificate_number: '',
            certificate_expiry: '',
        },
    });

    const onSubmit = (data) => {
        setEditError(false);
        AxiosInstance.put("machines/" + id + "/", {
            name: data.name,
            certificate: data.certificate.value,
            certificate_number: data.certificate_number,
            certificate_expiry_date: dayjs(data.certificate_expiry).format("YYYY-MM-DD"),
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
                minWidth: '300px',
            }}>
                {
                    loading ?
                        <Waiting/>
                        :
                        <>
                            <DialogTitle id="responsive-dialog-title">
                                {"Редактировать сотрудника"}
                            </DialogTitle>

                            <form onSubmit={handleSubmit(onSubmit)}
                                  style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <DialogContent>
                                    <MyTextField name="name" label="Называние" type="text" control={control}/>
                                    <MySelectField name={"certificate"} label={"Сертификат"} options={certificates}
                                                   control={control}/>
                                    <MyTextField name={"certificate_number"} label={"Номер сертификата"} type="text"
                                                 control={control}/>
                                    <MyDatePickerField name={"certificate_expiry"} label={"Срок сертификата"}
                                                       control={control}/>
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
                        </>
                }
            </Container>
        </Dialog>
    );
}