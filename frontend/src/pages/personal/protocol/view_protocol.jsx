import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";

export default function ViewProtocol(props) {
    const {protocol} = props;
    const [settings, setSettings] = useState({});
    const [protocolHeaders, setProtocolHeaders] = useState([]);
    const [protocolData, setProtocolData] = useState([]);

    function getData() {
        const s = JSON.parse(protocol.type.settings);
        setSettings(s);

        if ("headers" in s) {
            setProtocolHeaders(s.headers);
        }

        setProtocolData(JSON.parse(protocol.data));
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box>
            <Grid
                container
                marginY={2}
                direction="row"
                sx={{
                    '--Grid-borderWidth': '1px',
                    borderTop: 'var(--Grid-borderWidth) solid',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center', // This does vertical centering
                        padding: 1,           // Optional: adds spacing inside each cell
                    },
                    color: "#888",
                }}
            >
                <Grid size={4}>
                    Наименование продукции
                </Grid>
                <Grid size={8}>
                    {protocol.product_name}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.product_name_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Обозначение и данные маркировки объекта испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.building_data}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.building_data_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Наименование изготовителя
                </Grid>
                <Grid size={8}>
                    {protocol.producer_name}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.product_name_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Вид испытания
                </Grid>
                <Grid size={8}>
                    {protocol.test_type}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.test_type_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    НД на объекты испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.rd_test_building}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.rd_test_building_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    НД на методы испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.rd_test_method}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.rd_test_method_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Дополнения, отклонения или исключения из метода
                </Grid>
                <Grid size={8}>
                    {protocol.addition}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.addition_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Испытания, проведенные субподрядчиком
                </Grid>
                <Grid size={8}>
                    {protocol.subcontractor}
                    {protocol.language === 'en' &&
                        `<br/>${protocol.subcontractor_eng}`
                    }
                </Grid>
                <Grid size={4}>
                    Дата начала испытания
                </Grid>
                <Grid size={8}>
                    {dayjs(protocol.start_date).format("DD.MM.YYYY")}
                </Grid>
                <Grid size={4}>
                    Дата завершения испытания
                </Grid>
                <Grid size={8}>
                    {dayjs(protocol.end_date).format("DD.MM.YYYY")}
                </Grid>
            </Grid>

            <Typography
                variant="body1"
                component="div"
            >
                Условия окружающей среды
            </Typography>

            <Grid
                container
                marginY={2}
                direction="row"
                sx={{
                    '--Grid-borderWidth': '1px',
                    borderTop: 'var(--Grid-borderWidth) solid',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center', // This does vertical centering
                        padding: 1,           // Optional: adds spacing inside each cell
                    },
                    color: "#888",
                }}
            >
                <Grid size={5} color={'CaptionText'} bgcolor={'ButtonShadow'}>
                    Температура
                </Grid>
                <Grid size={7}>
                    {protocol.temperature_from} - {protocol.temperature_to} °С
                </Grid>
                <Grid size={5} color={'CaptionText'} bgcolor={'ButtonShadow'}>
                    Относительная влажность
                </Grid>
                <Grid size={7}>
                    {protocol.humidity_from} - {protocol.humidity_to} %
                </Grid>
            </Grid>

            <Typography
                variant="body1"
                component="div"
            >
                При испытании использовались следующие приборы и средства измерений
            </Typography>

            <Grid
                container
                marginY={2}
                direction="row"
                sx={{
                    '--Grid-borderWidth': '1px',
                    borderTop: 'var(--Grid-borderWidth) solid',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center', // This does vertical centering
                        padding: 1,           // Optional: adds spacing inside each cell
                    },
                    color: "textSecondary",
                }}
            >
                <Grid size={6} color={'CaptionText'} bgcolor={'ButtonShadow'}>Наименование</Grid>
                <Grid size={3} color={'CaptionText'} bgcolor={'ButtonShadow'}>№ сертификата</Grid>
                <Grid size={3} color={'CaptionText'} bgcolor={'ButtonShadow'}>Годен до</Grid>
                {
                    protocol.machines.map((machine) => {
                        return (
                            <React.Fragment key={machine.id}>
                                <Grid size={6}>{machine.name}</Grid>
                                <Grid size={3}>{machine.certificate_number}</Grid>
                                <Grid size={3}>{dayjs(machine.certificate_expiry_date).format('DD.MM.YYYY')}</Grid>
                            </React.Fragment>
                        )
                    })
                }
            </Grid>

            {
                "headers" in settings &&

                <Box>
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{marginY: 'auto'}}
                    >
                        Результаты испытаний
                    </Typography>

                    <Grid
                        container
                        sx={{
                            marginTop: "15px",
                            marginBottom: 2,
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
                        columns={{xs: 190, sm: 190, md: 190, lg: 190, xl: 190}}
                    >
                        {
                            protocolHeaders.map((header, i) => {
                                return (
                                    <Grid
                                        size={settings.col_widths[i]}
                                        key={"protocol_header_" + i}
                                        padding={1}
                                        textAlign='center'
                                        alignContent="center"
                                    >
                                        {header}
                                    </Grid>
                                );
                            })
                        }

                        {
                            protocolData.map((field, i) => {
                                    return settings.fields.map((col, j) => {
                                            let content = null;
                                            if (col['type'] === 'i') {
                                                content = i + 1;
                                            } else if (col['type'] === 'text') {
                                                content = col['label'];
                                            } else if (
                                                col['type'] === 'text_field'
                                                || col['type'] === 'number_field'
                                                || col['type'] === 'textarea_field'
                                            ) {
                                                if (col['name'] in field) {
                                                    content = field[col['name']];
                                                }
                                            } else if (col['type'] === 'date_field') {
                                                content = dayjs(col['label']).format('DD.MM.YYYY');
                                            }

                                            return (
                                                <Grid
                                                    key={"protocol_table_" + i + "_" + j}
                                                    size={settings.col_widths[j]}
                                                    padding={1}
                                                    textAlign='center'
                                                    alignContent="center"
                                                    color={"#888"}
                                                >
                                                    {content}
                                                </Grid>
                                            );
                                        }
                                    )
                                }
                            )
                        }
                    </Grid>

                </Box>
            }

            {protocol.note.length > 0 &&
                <>
                    <Typography
                        variant="body1"
                        component="div"
                    >
                        Примечание
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        color={"textSecondary"}
                    >
                        {protocol.note}
                    </Typography>
                </>
            }
        </Box>
    )
}