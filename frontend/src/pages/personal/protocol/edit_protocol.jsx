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
import Swal from 'sweetalert2'
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate} from 'react-router-dom';

export default function EditProtocol(props) {
    const {protocol, availableMachines} = props;
    const [settings, setSettings] = React.useState({});
    const [selectedLang, setSelectedLang] = React.useState('ru');

    const [protocolHeaders, setProtocolHeaders] = React.useState(null);

    const navigate = useNavigate();

    const validationSchemeRu = (fields) => {
        return yup.object().shape({
            product_name: yup.string().required('Заполните поля'),
            building_data: yup.string().required('Заполните поля'),
            producer_name: yup.string().required('Заполните поля'),
            test_type: yup.string().required('Заполните поля'),
            rd_test_building: yup.string().required('Заполните поля'),
            rd_test_method: yup.string().required('Заполните поля'),
            addition: yup.string().required('Заполните поля'),
            subcontractor: yup.string().required('Заполните поля'),
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
    }

    const validationSchemeEn = (fields) => {
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
            resolver: yupResolver(selectedLang === 'ru' ? validationSchemeRu([]) : validationSchemeEn([])),
            defaultValues: {
                machines: [],
                data: [],
                language: {value: selectedLang, label: protocol.language === 'ru' ? 'Русский' : 'Английский'},
            }
        }
    );


    const {fields, append, remove} = useFieldArray({
        control,
        name: "machines",
    });

    function loadProtocolData() {
        const data = JSON.parse(protocol.data);

        if (data.length > 0) {
            data.map((d, index) => {
                Object.entries(d).map(([k, v]) => {
                    setValue(`data.${index}.${k}`, v);
                });
            });
        }
    }

    function getData() {
        setSettings(JSON.parse(protocol.type.settings));

        loadProtocolData();

        setSelectedLang(protocol.language);
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
    }

    useEffect(() => {
        if (protocol) {
            getData();
        }
    }, [protocol]);

    const onError = (errors) => {
        Swal.fire({
            title: 'Заполните все поля',
            icon: "error",
        });
        // console.log('❌ Form errors:', errors);
    };

    const onSubmit = (data) => {
        let m = [];
        data.machines.map((machine) => {
            m.push(machine.value.value);
        })


        AxiosInstance.put(`update_protocol/${protocol.id}`, {
            language: selectedLang,
            protocol: data.data,
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
                    navigate(0);
                    // navigate(-1); // Go back
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    let {fields: dataFields, append: dataAppend, remove: dataRemove} = useFieldArray({
        control,
        name: "data",
    })

    function addDataField(i) {
        let f = [];
        if (protocol !== null) {
            settings.fields.map((field, index) => {
                if (field['type'] === 'i') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={settings.col_widths[index]}
                            padding={1}
                            textAlign='center'
                            alignContent="center"
                        >
                            {i + 1}
                        </Grid>
                    );
                } else if (field['type'] === 'text_field') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={settings.col_widths[index]}
                            padding={1}
                            textAlign='center'
                            alignContent="center"
                        >
                            <MyTextField name={`data.${i}.${field.name}`} control={control}/>
                        </Grid>
                    )
                } else if (field['type'] === 'textarea_field') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={settings.col_widths[index]}
                            padding={1}
                            textAlign='center'
                            alignContent="center"
                        >
                            <MyTextareaField name={`data.${i}.${field.name}`} control={control}/>
                        </Grid>
                    )
                } else if (field['type'] === 'number_field') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={settings.col_widths[index]}
                            padding={1}
                            type={"number"}
                            textAlign='center'
                            alignContent="center"
                        >
                            <MyTextField name={`data.${i}.${field.name}`} control={control}/>
                        </Grid>
                    )
                } else if (field['type'] === 'date_field') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={settings.col_widths[index]}
                            padding={1}
                            textAlign='center'
                            alignContent="center"
                        >
                            <MyDatePickerField
                                name={`data.${i}.${field.name}`}
                                label="Дата"
                                control={control}
                            />
                        </Grid>
                    )
                }
            })
        }

        f.push(
            <Grid
                key={"protocol_table_remove" + i}
                size={15}
                padding={1}
                textAlign='center'
                alignContent="center"
            >
                <IconButton
                    onClick={() => {
                        setValue(`data.${i}`, {});
                        dataRemove(i)
                    }}
                >
                    <DeleteIcon/>
                </IconButton>
            </Grid>
        )
        return (f)
    }


    useEffect(() => {
        if ("headers" in settings) {
            let h = [];

            settings['headers' + (selectedLang === 'en' ? '_en' : '')].map((header, index) => {
                h.push(<Grid
                    key={"protocol_table_header_" + index}
                    size={settings.col_widths[index]}
                    padding={1}
                    textAlign='center'
                    alignContent="center"
                >
                    {header}
                </Grid>);
            })
            h.push(
                <Grid
                    key={"protocol_table_header_add"}
                    size={15}
                    padding={1}
                    textAlign='center'
                    alignContent="center"
                >
                    <IconButton onClick={() => dataAppend({})}><Add/></IconButton>
                </Grid>
            )

            setProtocolHeaders(h)
            while (dataFields.length > 0) {
                dataRemove(dataFields.pop())
            }

            dataAppend([])

            loadProtocolData();
        }

    }, [selectedLang, settings]);


    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2} marginY={2} size={12}>
                <Grid size={{md: 12, xs: 12}}>
                    <MySelectField
                        name="language"
                        label="Язык"
                        options={[
                            {value: 'ru', label: 'Русский'},
                            {value: 'en', label: 'Английский'},
                        ]}
                        onSelected={
                            (lang) => {
                                setSelectedLang(lang.value);
                            }
                        }
                        control={control}
                    />
                </Grid>
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"product_name"}
                        label={"Наименование продукции"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name="product_name_eng"
                            label="Product name"
                            control={control}
                        />
                    </Grid>
                }

                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"building_data"}
                        label={"Обозначение и данные маркировки объекта испытаний"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"building_data_eng"}
                            label={"Designation and marking data of the test object"}
                            control={control}
                        />
                    </Grid>
                }

                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"producer_name"}
                        label={"Наименование изготовителя"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"producer_name_eng"}
                            label={"Manufacturer’s name"}
                            control={control}
                        />
                    </Grid>
                }
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"test_type"}
                        label={"Вид испытания"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"test_type_eng"}
                            label={"Type of test"}
                            control={control}
                        />
                    </Grid>
                }
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"rd_test_building"}
                        label={"НД на объекты испытаний"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_building_eng"}
                            label={"RD on test object"}
                            control={control}
                        />
                    </Grid>
                }
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"rd_test_method"}
                        label={"НД на методы испытаний"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"rd_test_method_eng"}
                            label={"RD on test methods"}
                            control={control}
                        />
                    </Grid>
                }
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"addition"}
                        label={"Дополнения, отклонения или исключения из метода"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"addition_eng"}
                            label={"Additions, deviations or exceptions to the method"}
                            control={control}
                        />
                    </Grid>
                }
                <Grid size={{md: 6, xs: 12}}>
                    <MyTextField
                        name={"subcontractor"}
                        label={"Испытания, проведенные субподрядчиком"}
                        control={control}
                    />
                </Grid>
                {selectedLang === 'en' &&
                    <Grid size={{md: 6, xs: 12}}>
                        <MyTextField
                            name={"subcontractor_eng"}
                            label={"Tests carried out by subcontractor"}
                            control={control}
                        />
                    </Grid>
                }
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
            <Box>
                {"headers" in settings &&
                    <Grid
                        container
                        sx={{
                            marginTop: "15px",
                            minWidth: "720px",
                            '--Grid-borderWidth': '1px',
                            borderTop: 'var(--Grid-borderWidth) solid',
                            borderLeft: 'var(--Grid-borderWidth) solid',
                            borderColor: 'divider',
                            wordWrap: 'break-word',
                            '& > div': {
                                borderRight: 'var(--Grid-borderWidth) solid',
                                borderBottom: 'var(--Grid-borderWidth) solid',
                                borderColor: 'divider',
                            },
                        }}
                        columns={{xs: 205, sm: 205, md: 205, lg: 205, xl: 205}}
                    >
                        {protocolHeaders}
                        {dataFields.length === 0 && <NoData message={"Добавьте данные"}/>}
                        {
                            dataFields.map((item, index) => {
                                return addDataField(index)
                            })
                        }
                    </Grid>
                }
            </Box>
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
    )
}