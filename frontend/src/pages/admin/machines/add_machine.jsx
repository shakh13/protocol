import {Container, Skeleton} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useState, useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import AxiosInstance from "../../../components/axios_instance.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ErrorMessage from "../../../components/ErrorMessage.jsx";


// const certificates = [
//     {value: 'cert1', label: 'Сертификат 1'},
//     {value: 'cert2', label: 'Сертификат 2'},
// ]

export default function AddMachine(props) {
    const {open, setOpen, updateData} = props;
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addError, setAddError] = useState(false);

    function getCertificates() {
        AxiosInstance.get("certificates/").then((response) => {
            let cert = [];
            response.data.map((certificate) => {
                cert.push({
                    value: certificate.id,
                    label: certificate.name,
                })
            });
            setCertificates(cert);
            setLoading(false);
        }).catch((error) => {
            setLoading(true);
        })
    }

    useEffect(() => {
        getCertificates();
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

    const {control, handleSubmit} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            certificate_number: '',
            certificate_expiry: '',
        },
    });

    const onSubmit = (data) => {
        setAddError(false);
        AxiosInstance.post("machines/", {
            name: data.name,
            certificate_number: data.certificate_number,
            certificate_expiry_date: dayjs(data.certificate_expiry).format("YYYY-MM-DD"),
            certificate: data.certificate.value,
        }).then((response) => {
            updateData();
            setOpen(false);
        }).catch((error) => {
            setAddError(true);
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
                        <>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                        </>
                        :
                        <>
                            <DialogTitle id="responsive-dialog-title">
                                {"Добавить оборудование"}
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
                                    {addError && <ErrorMessage message={"Ошибка добавления оборудования"}/>}
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