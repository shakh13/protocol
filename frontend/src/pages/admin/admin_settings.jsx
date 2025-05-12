import {Card, CardActions, CardContent, Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from '@mui/material/Grid2';
import Box from "@mui/material/Box";
import MyTextField from "../../components/forms/MyTextField.jsx";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import MyFileField from "../../components/forms/MyFileField.jsx";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import {uploadFile} from "../../components/axios_instance.jsx"

import SaveIcon from '@mui/icons-material/Save';
import Waiting from "../../components/Waiting.jsx";
import MyTextareaField from "../../components/forms/MyTextareaField.jsx";
import Swal from "sweetalert2";

export default function AdminSettings(props) {
    const [loading, setLoading] = useState(false);
    const [laboratoryId, setLaboratoryId] = useState(0);
    const [saving, setSaving] = useState(false);
    const [printUrl, setPrintUrl] = useState("");

    function getData() {
        setLoading(true);

        AxiosInstance.get('laboratory/')
            .then(res => {
                const laboratory = res.data[0]
                setLaboratoryId(laboratory.id);
                setValue('name', laboratory.name);
                setValue('name_en', laboratory.name_en);
                setValue('address', laboratory.address);
                setValue('address_en', laboratory.address_en);
                setValue('boss', laboratory.boss);
                setValue('boss_en', laboratory.boss_en);
                setValue('email', laboratory.email);
                setValue('phone_number', laboratory.phone);
                setValue('protocol_ending', laboratory.protocol_ending);
                setValue('protocol_ending_en', laboratory.protocol_ending_en);
                setPrintUrl(laboratory.print);
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

    const schema = yup.object({
        name: yup.string()
            .required('Введите название')
            .min(3, "Имя должно содержать не менее 3 букв"),
        name_en: yup.string()
            .required('Enter name')
            .min(3, "The name must contain at least 3 letters"),
        boss: yup.string()
            .required('Введите полное имя начальника')
            .min(3, "Имя начальника должно содержать не менее 3 букв"),
        boss_en: yup.string()
            .required('Enter the full name of the boss')
            .min(3, "The boss's name must contain at least 3 letters."),
        address: yup.string()
            .required('Введите адрес лаборатории')
            .min(3, "Адрес должно содержать не менее 3 букв"),
        address_en: yup.string()
            .required('Enter the laboratory address')
            .min(3, "The address must contain at least 3 letters"),
        email: yup.string().email()
            .required('Введите Email')
            .min(5, 'Email должно содержать не менее 5 букв'),
        phone_number: yup.string()
            .required('Введите номер телефона')
            .min(9, "Номер телефона должно содержать не менее 9 цифр")
    });

    const {control, handleSubmit, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            name_en: '',
            boss: '',
            boss_en: '',
            address: '',
            address_en: '',
            email: '',
            phone_number: '',
            protocol_ending: '',
            protocol_ending_en: '',
        },
        mode: 'all',
    });

    const onSubmit = (data) => {
        setSaving(true);
        if (laboratoryId > 0) {
            if (data.print)
                uploadFile('print', 'laboratory/' + laboratoryId + "/", false, data.print)
                    .then((res) => {
                        // console.log(res);
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: error,
                            icon: "error",
                        });
                    });
            AxiosInstance.put("laboratory/" + laboratoryId + "/", {
                name: data.name,
                name_en: data.name_en,
                address: data.address,
                address_en: data.address_en,
                boss: data.boss,
                boss_en: data.boss_en,
                email: data.email,
                phone: data.phone_number,
                protocol_ending: data.protocol_ending,
                protocol_ending_en: data.protocol_ending_en,
            })
                .then((response) => {
                    getData();
                    setSaving(false);
                })
                .catch((error) => {
                    Swal.fire({
                        title: error,
                        icon: "error",
                    });
                })
        }
    }

    return (
        <Container>
            <Typography variant="h6" component="div">Настройки</Typography>
            {loading
                ? <Waiting/>
                : <>
                    <form onSubmit={handleSubmit(onSubmit)} encType={"multipart/form-data"}>
                        <Card sx={{marginTop: "15px"}}>
                            <CardContent>
                                <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 16}}>
                                    Лаборатория
                                </Typography>
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextField name={"name"} label={"Название лаборатории"}
                                                         control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextField name={"name_en"} label={"Laboratory name"}
                                                         control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 6, md: 6}}>
                                            <MyTextField name={"boss"} label={"Полное имя начальника"}
                                                         control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 6, md: 6}}>
                                            <MyTextField name={"boss_en"} label={"Полное имя начальника"}
                                                         control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextField name={"address"} label={"Адрес"} control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextField name={"address_en"} label={"Address"} control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <MyTextField name={"email"} label={"Email"} control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <MyTextField name={"phone_number"} label={"Номер телефона"}
                                                         control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextareaField name={"protocol_ending"} label={"Конец протокола"}
                                                             control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyTextareaField name={"protocol_ending_en"} label={"End of protocol"}
                                                             control={control}/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 12}}>
                                            <MyFileField name={"print"} label={"Печать"} control={control}/>
                                        </Grid>
                                        <Grid container spacing={2} size={{xs: 12, md: 4}} offset={{xs: 0, md: 4}}>
                                            <img
                                                width="100%"
                                                src={printUrl ? printUrl : null}
                                                alt={"Печать"}
                                                loading={"eager"}
                                            />

                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardActions sx={{justifyContent: 'flex-end'}}>
                                <Button
                                    loading={saving}
                                    loadingPosition="start"
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon/>}
                                    color="primary"
                                    sx={{
                                        width: {xs: "100%", md: "25%"}, // xs: 12 (full width), md: 3 (25% width)
                                    }}
                                >
                                    Сохранить
                                </Button>
                            </CardActions>
                        </Card>

                    </form>
                </>

            }
        </Container>
    );
}