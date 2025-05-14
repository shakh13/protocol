import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Container, IconButton} from "@mui/material";
import * as React from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import {useEffect} from "react";
import Waiting from "../../components/Waiting.jsx";
import MySelectField from "../../components/forms/MySelectField.jsx";
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid from "@mui/material/Grid2";
import MyTextField from "../../components/forms/MyTextField.jsx";
import MyDatePickerField from "../../components/forms/MyDatePickerField.jsx";
import MyTextareaField from "../../components/forms/MyTextareaField.jsx";
import {Add, Delete} from "@mui/icons-material";
import NoData from "../../components/NoData.jsx";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";


export default function CreatePage(props) {
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [clients, setClients] = React.useState([]);
    const [buildings, setBuildings] = React.useState([]);
    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const [selectedLang, setSelectedLang] = React.useState('ru');
    const [selectedClient, setSelectedClient] = React.useState(null);
    const [selectedProtocol, setSelectedProtocol] = React.useState(null);

    const [protocolHeaders, setProtocolHeaders] = React.useState(null);

    const [machines, setMachines] = React.useState([]);

    const [protocolTypes, setProtocolTypes] = React.useState([]);


    function getData() {
        setLoading(true);
        AxiosInstance.get("me")
            .then((response) => {
                setUser(response.data);
                let cli = [];
                response.data.clients.map((client) => {
                    cli.push({
                        value: client.id,
                        label: client.name,
                    });
                });
                setClients(cli);
                let b = [];
                response.data.buildings.map((building) => {
                    b.push({
                        value: building.id,
                        label: building.name,
                        client: building.client,
                    });
                })
                setBuildings(b);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });

        AxiosInstance.get("protocol-types/")
            .then((response) => {
                let pt = []
                response.data.forEach((ptype) => {
                    pt.push({
                        value: ptype.id,
                        label: ptype.name,
                        settings: JSON.parse(ptype.settings),
                    });
                });
                setProtocolTypes(pt);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });

        AxiosInstance.get("machines/")
            .then((response) => {
                let m = [];
                response.data.map((machine) => {
                    m.push({
                        value: machine.id,
                        label: machine.name,
                    })
                })
                setMachines(m);
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

    const validationSchemeRu = (fields) => {
        return yup.object().shape({
            client: yup.object().required('Выберите заказчика'),
            protocol_type: yup.object().required('Выберите протокол'),
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
            client: yup.object().required('Выберите заказчика'),
            protocol_type: yup.object().required('Выберите протокол'),
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
                language: {value: 'ru', label: 'Русский'},
            }
        }
    );


    const {fields, append, remove} = useFieldArray({
        control,
        name: "machines",
    });

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

        AxiosInstance.post("add_protocol/", {
            client_id: data.client.value,
            building_id: data.building !== null ? data.building.value : null,
            type_id: data.protocol_type.value,
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
                if (response.status === 201) {
                    window.location.href = '/protocol/' + response.data.id;
                } else {
                    alert('Ошибка добавления протокола!');
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    // Works when client changes
    useEffect(() => {
        setValue("building", null);
    }, [selectedClient]);

    let {fields: dataFields, append: dataAppend, remove: dataRemove} = useFieldArray({
        control,
        name: "data",
    })

    function addDataField(i) {
        let f = [];
        if (selectedProtocol !== null) {

            selectedProtocol.settings.fields.map((field, index) => {
                if (field['type'] === 'i') {
                    f.push(
                        <Grid
                            key={"protocol_table_" + i + "_" + index}
                            size={selectedProtocol.settings.col_widths[index]}
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
                            size={selectedProtocol.settings.col_widths[index]}
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
                            size={selectedProtocol.settings.col_widths[index]}
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
                            size={selectedProtocol.settings.col_widths[index]}
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
                            size={selectedProtocol.settings.col_widths[index]}
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
                <IconButton onClick={() => dataRemove(i)}>
                    {/* edit here to remove not last item, but item by index */}
                    <DeleteIcon/>
                </IconButton>
            </Grid>
        )

        return (f)
    }

    useEffect(() => {
        if (selectedProtocol) {
            if ("headers" in selectedProtocol.settings) {
                let h = [];
                selectedProtocol.settings['headers' + (selectedLang === 'en' ? '_en' : '')].map((header, index) => {
                    h.push(<Grid
                        key={"protocol_table_header_" + index}
                        size={selectedProtocol.settings.col_widths[index]}
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
            }
        }

        while (dataFields.length > 0) {
            dataRemove(dataFields.pop())
        }

        dataAppend({})

    }, [selectedProtocol, selectedLang]);


    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography
                    variant="h6"
                    component="div"
                >
                    Создать протокол
                </Typography>
            </Box>
            <Box sx={{marginTop: '15px'}}>
                {loading
                    ? <Waiting/>
                    : <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <Box>
                            <MySelectField
                                name="client"
                                label="Заказчик"
                                options={clients}
                                onSelected={
                                    (client) => {
                                        setSelectedClient(client);
                                    }
                                }
                                control={control}
                            />
                            <MySelectField
                                name="building"
                                label="Объект"
                                options={selectedClient ? buildings.filter(building => building.client === selectedClient.value) : {}}
                                onSelected={
                                    (building) => {
                                        setSelectedBuilding(building);
                                    }
                                }
                                control={control}
                            />
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
                            <MySelectField
                                name="protocol_type"
                                label="Протокол"
                                options={protocolTypes}
                                onSelected={(protocol) => {
                                    setSelectedProtocol(protocol);
                                }}
                                control={control}
                            />
                            {
                                (selectedProtocol !== null)
                                    ? <Box>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            color={"textSecondary"}
                                            sx={{marginY: 2}}
                                        >
                                            Протокол - {selectedProtocol.label}
                                        </Typography>

                                        <Grid container spacing={2} marginY={2}>
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
                                                        name={"product_name_eng"}
                                                        label={"Product name"}
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
                                                                options={machines}
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
                                                        defaultValue={20}
                                                        type="number"
                                                        adornment={"°С"}
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid size={{md: 3, xs: 6}}>
                                                    <MyTextField
                                                        name={"temperature_to"}
                                                        label="Температура до"
                                                        defaultValue={22}
                                                        type="number"
                                                        adornment={"°С"}
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid size={{md: 3, xs: 6}}>
                                                    <MyTextField
                                                        name={"humidity_from"}
                                                        label="Влажность от"
                                                        defaultValue={50}
                                                        type="number"
                                                        adornment={"%"}
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid size={{md: 3, xs: 6}}>
                                                    <MyTextField
                                                        name={"humidity_to"}
                                                        label="Влажность до"
                                                        defaultValue={55}
                                                        type="number"
                                                        adornment={"%"}
                                                        control={control}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Box>
                                            {"headers" in selectedProtocol.settings &&
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
                                                        dataFields.map((item, index) => (
                                                            addDataField(index)
                                                        ))
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
                                        </Box>
                                    </Box>
                                    : null
                            }
                        </Box>
                    </form>
                }
            </Box>
        </Container>
    );
}