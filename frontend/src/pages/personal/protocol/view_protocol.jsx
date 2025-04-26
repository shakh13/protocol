import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import ProtocolView from "../protocol_forms/protocol_view.jsx";

export default function ViewProtocol(props) {
    const {protocol} = props;

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
                    <br/>
                    {protocol.product_name_eng}
                </Grid>
                <Grid size={4}>
                    Обозначение и данные маркировки объекта испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.building_data}
                    <br/>
                    {protocol.building_data_eng}
                </Grid>
                <Grid size={4}>
                    Наименование изготовителя
                </Grid>
                <Grid size={8}>
                    {protocol.producer_name}
                    <br/>
                    {protocol.producer_name_eng}
                </Grid>
                <Grid size={4}>
                    Вид испытания
                </Grid>
                <Grid size={8}>
                    {protocol.test_type}
                    <br/>
                    {protocol.test_type_eng}
                </Grid>
                <Grid size={4}>
                    НД на объекты испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.rd_test_building}
                    <br/>
                    {protocol.rd_test_building_eng}
                </Grid>
                <Grid size={4}>
                    НД на методы испытаний
                </Grid>
                <Grid size={8}>
                    {protocol.rd_test_method}
                    <br/>
                    {protocol.rd_test_method_eng}
                </Grid>
                <Grid size={4}>
                    Дополнения, отклонения или исключения из метода
                </Grid>
                <Grid size={8}>
                    {protocol.addition}
                    <br/>
                    {protocol.addition_eng}
                </Grid>
                <Grid size={4}>
                    Испытания, проведенные субподрядчиком
                </Grid>
                <Grid size={8}>
                    {protocol.subcontractor}
                    <br/>
                    {protocol.subcontractor_eng}
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
                <Grid size={5}>
                    Температура / Temperature
                </Grid>
                <Grid size={7}>
                    {protocol.temperature_from} - {protocol.temperature_to} °С
                </Grid>
                <Grid size={5}>
                    Относительная влажность / Relative humidity
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

            <ProtocolView protocol={protocol}/>

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

        </Box>
    )
}