import Box from "@mui/material/Box";
import * as yup from "yup";
import {useEffect} from "react";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import MyTextareaField from "../../../components/forms/MyTextareaField.jsx";
import Grid from "@mui/material/Grid2";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import {IconButton, Tooltip} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import NoData from "../../../components/NoData.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import AxiosInstance from "../../../components/axios_instance.jsx";
import dayjs from "dayjs";
import ProtocolForm from "../protocol_forms/protocol_form.jsx";
import Swal from 'sweetalert2'

export default function EditProtocol(props) {
    const {protocol, availableMachines} = props;

    const getValidationSchema = (fields) => {
        return yup.object().shape({
            product_name: yup.string().required('Заполните поля'),
            product_name_eng: yup.string().required('Заполните поля'),
            building_data: yup.string().required('Заполните поля'),
            building_data_eng: yup.string().required('Заполните поля'),
            producer_name: yup.string().required('Заполните поля'),
            producer_name_eng: yup.string().required('Заполните поля'),
            test_type: yup.string().required('Заполните поля'),
            test_type_eng: yup.string().required('Заполните поля'),
            rd_test_building: yup.string().required('Заполните поля'),
            rd_test_building_eng: yup.string().required('Заполните поля'),
            rd_test_method: yup.string().required('Заполните поля'),
            rd_test_method_eng: yup.string().required('Заполните поля'),
            addition: yup.string().required('Заполните поля'),
            addition_eng: yup.string().required('Заполните поля'),
            subcontractor: yup.string().required('Заполните поля'),
            subcontractor_eng: yup.string().required('Заполните поля'),
            start_date: yup.date().required('Выберите дата начала испытания'),
            end_date: yup.date().required('Выберите дата завершения испытания'),
            temperature_from: yup.number().required('Заполните поля'),
            temperature_to: yup.number().required('Заполните поля'),
            humidity_from: yup.number().required('Заполните поля'),
            humidity_to: yup.number().required('Заполните поля'),
            machines: yup.array().of(yup.object().shape({
                value: yup.object().required("Выберите прибор"),
            })),
        });
    };

    const {control, handleSubmit, setValue} = useForm(
        {
            resolver: yupResolver(getValidationSchema([])),
        }
    );


    const {fields, append, remove} = useFieldArray({
        control,
        name: "machines",
    });

    function getData() {
        setValue("machines", (protocol.machines || []).map((machine) => {
            return {
                value: {
                    value: machine.id,
                    label: machine.name,
                }
            };
        }));
        setValue('product_name', protocol.product_name)
        setValue('product_name_eng', protocol.product_name_eng)
        setValue('building_data', protocol.building_data)
        setValue('building_data_eng', protocol.building_data_eng)
        setValue('producer_name', protocol.producer_name)
        setValue('producer_name_eng', protocol.producer_name_eng)
        setValue('test_type', protocol.test_type)
        setValue('test_type_eng', protocol.test_type_eng)
        setValue('rd_test_building', protocol.rd_test_building)
        setValue('rd_test_building_eng', protocol.rd_test_building_eng)
        setValue('rd_test_method', protocol.rd_test_method)
        setValue('rd_test_method_eng', protocol.rd_test_method_eng)
        setValue('addition', protocol.addition)
        setValue('addition_eng', protocol.addition_eng)
        setValue('subcontractor', protocol.subcontractor)
        setValue('subcontractor_eng', protocol.subcontractor_eng)
        setValue('start_date', protocol.start_date)
        setValue('end_date', protocol.end_date)
        setValue('temperature_from', protocol.temperature_from)
        setValue('temperature_to', protocol.temperature_to)
        setValue('humidity_from', protocol.humidity_from)
        setValue('humidity_to', protocol.humidity_to)
        setValue('note', protocol.note)

        if (protocol.data) {
            try {
                const parsedData = JSON.parse(protocol.data);
                Object.entries(parsedData).forEach(([key, value]) => {
                    setValue(key, value);
                });
            } catch (e) {
                console.error("Invalid JSON in protocol.data:", protocol.data);
            }
        }
    }

    useEffect(() => {
        if (protocol) {
            getData();
        }
    }, [append, protocol]);

    const onSubmit = (data) => {
        let d = {};
        const settings = JSON.parse(protocol.type.settings)
        settings['fields'].map((field) => {
            field.map((col) => {
                if (col['type'] !== 'i' && col['type'] !== 'text') {
                    if (col['type'] === 'date_field') {
                        d[col.name] = dayjs(data[col.name]).format("YYYY-MM-DD")
                    } else {
                        d[col.name] = data[col.name]
                    }
                }
            });
        });

        let m = [];
        data.machines.map((machine) => {
            m.push(machine.value.value);
        })


        AxiosInstance.put(`update_protocol/${protocol.id}`, {
            client: protocol.client.id,
            building: protocol.client ? protocol.client.id : null,
            type: protocol.type.id,
            protocol: d,
            machines: m,
            note: data.note,
            product_name: data.product_name,
            product_name_eng: data.product_name_eng,
            building_data: data.building_data,
            building_data_eng: data.building_data_eng,
            producer_name: data.producer_name,
            producer_name_eng: data.producer_name_eng,
            test_type: data.test_type,
            test_type_eng: data.test_type_eng,
            rd_test_building: data.rd_test_building,
            rd_test_building_eng: data.rd_test_building_eng,
            rd_test_method: data.rd_test_method,
            rd_test_method_eng: data.rd_test_method_eng,
            addition: data.addition,
            addition_eng: data.addition_eng,
            subcontractor: data.subcontractor,
            subcontractor_eng: data.subcontractor_eng,
            start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
            end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
            temperature_from: data.temperature_from,
            temperature_to: data.temperature_to,
            humidity_from: data.humidity_from,
            humidity_to: data.humidity_to,
        })
            .then(response => {
                Swal.fire({
                    title: response && response.status === 200 ? "Протокол успешно обновлен" : response.data['error'],
                    icon: response && response.status === 200 ? "success" : "error",
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    const completeProtocol = () => {
        AxiosInstance.put("update_protocol_status/" + protocol.id, {
            status: 1,
        })
            .then(response => {
                Swal.fire({
                    title: "Протокол завершен",
                    icon: "success",
                }).then((result) => {
                    window.location.href = "/protocols";
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} marginY={2}>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"product_name"}
                            label={"Наименование продукции"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"product_name_eng"}
                            label={"Product name"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"building_data"}
                            label={"Обозначение и данные маркировки объекта испытаний"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"building_data_eng"}
                            label={"Designation and marking data of the test object"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"producer_name"}
                            label={"Наименование изготовителя"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"producer_name_eng"}
                            label={"Manufacturer’s name"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"test_type"}
                            label={"Вид испытания"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"test_type_eng"}
                            label={"Type of test"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_building"}
                            label={"НД на объекты испытаний"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_building_eng"}
                            label={"RD on test object"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_method"}
                            label={"НД на методы испытаний"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_method_eng"}
                            label={"RD on test methods"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"addition"}
                            label={"Дополнения, отклонения или исключения из метода"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"addition_eng"}
                            label={"Additions, deviations or exceptions to the method"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"subcontractor"}
                            label={"Испытания, проведенные субподрядчиком"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"subcontractor_eng"}
                            label={"Tests carried out by subcontractor"}
                            control={control}
                        />
                    </Grid>

                    <Grid size={{md: 6, xs: 12}}>
                        <MyDatePickerField
                            name={"start_date"}
                            label={"Дата начала испытания"}
                            control={control}
                        />
                    </Grid>
                    <Grid size={{md: 6, xs: 12}}>
                        <MyDatePickerField
                            name={"end_date"}
                            label={"Дата завершения испытания"}
                            control={control}
                        />
                    </Grid>
                </Grid>

                <Box sx={{marginTop: "15px"}}>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Typography
                            variant="body1"
                            component="div"
                            color={"textSecondary"}
                            sx={{marginY: 'auto'}}
                        >
                            Приборы и средства измерений
                        </Typography>
                        <IconButton onClick={() => append({})}>
                            <Add color={"primary"}/>
                        </IconButton>
                    </Box>
                    {fields.length === 0 && <NoData message={"Добавьте прибор!"}/>}
                    {
                        fields.map((item, index) => (
                            <Grid
                                container
                                spacing={"10px"}
                                key={"machine_" + item.id}
                            >
                                <Grid size={11}>
                                    <MySelectField
                                        name={`machines.${index}.value`}
                                        label={"Прибор"}
                                        control={control}
                                        options={availableMachines}
                                    />
                                </Grid>
                                <Grid size={1}
                                      alignContent={"start"}
                                      height={"55px"}
                                      paddingY={"8px"}
                                      marginX={"auto"}
                                >
                                    <IconButton
                                        onClick={() => remove(index)}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))
                    }
                </Box>

                <Box sx={{marginY: 2}}>
                    <Typography
                        variant="body1"
                        component="div"
                        color={"textSecondary"}
                        sx={{marginTop: 2, marginBottom: 1}}
                    >
                        Условия окружающей среды / Environmental conditions
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid size={{md: 3, xs: 6}}>
                            <MyTextField
                                name={"temperature_from"}
                                label="Температура от"
                                type="number"
                                adornment={"°С"}
                                control={control}
                            />
                        </Grid>
                        <Grid size={{md: 3, xs: 6}}>
                            <MyTextField
                                name={"temperature_to"}
                                label="Температура до"
                                type="number"
                                adornment={"°С"}
                                control={control}
                            />
                        </Grid>
                        <Grid size={{md: 3, xs: 6}}>
                            <MyTextField
                                name={"humidity_from"}
                                label="Влажность от"
                                type="number"
                                adornment={"%"}
                                control={control}
                            />
                        </Grid>
                        <Grid size={{md: 3, xs: 6}}>
                            <MyTextField
                                name={"humidity_to"}
                                label="Влажность до"
                                type="number"
                                adornment={"%"}
                                control={control}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {protocol?.type?.settings && (
                    <Box>
                        <ProtocolForm control={control} settings={JSON.parse(protocol.type.settings)}/>
                    </Box>
                )}
                <Box sx={{marginY: 2}}>
                    <Typography
                        variant="body1"
                        component="div"
                        color={"textSecondary"}
                        sx={{marginTop: 2, marginBottom: 1}}
                    >
                        Примечание / Note
                    </Typography>
                    <MyTextareaField
                        name={"note"}
                        label={"Примечание / Note"}
                        control={control}
                    />
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'flex-end', marginY: "10px"}}>
                    <Button
                        variant="outlined"
                        type="submit"
                        sx={{
                            width: {xs: "100%", md: "25%"}, // xs: 12 (full width), md: 3 (25% width)
                        }}
                    >
                        Сохранить
                    </Button>
                    <Tooltip title={"Сначало сохраните"}>
                        <Button
                            variant="outlined"
                            type="button"
                            onClick={completeProtocol}
                            sx={{
                                width: {xs: "100%", md: "25%"}, // xs: 12 (full width), md: 3 (25% width)
                                marginLeft: 1,
                            }}
                        >
                            Завершить
                        </Button>
                    </Tooltip>
                </Box>
            </form>
        </>
    )
}