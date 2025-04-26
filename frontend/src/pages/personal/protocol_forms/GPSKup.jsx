import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";

export default function GPSKup(props) {
    const {control} = props;

    return (
        <>
            <Box sx={{marginTop: "15px"}}>
                <Typography
                    variant="body1"
                    component="div"
                    color="textSecondary"
                    sx={{marginY: 'auto'}}
                >
                    Результаты испытаний
                </Typography>

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
                >
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Место отбора проб
                        <br/>
                        Sampling location
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Плотность ГПС во влажном состоянии
                        <br/>
                        GSM density in wet state,
                        <br/>
                        g/сm3
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Влажность
                        <br/>
                        Humidity
                        <br/>%
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Плотность ГПС в сухом состоянии
                        <br/>
                        GSM density in dry state,
                        <br/>
                        g/сm3
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Максимальная плотность ГПС
                        <br/>
                        Maximum density of GSM,
                        <br/>
                        g/сm3
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Коэффициент уплотнения
                        <br/>
                        Compaction coefficient
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Требование по проекту
                        <br/>
                        Project requirement
                        <br/>
                        (Куп)
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Выводы
                    </Grid>

                    <Grid
                        size={2}
                        padding={1}
                        sx={{alignContent: 'center'}}
                    >
                        Точка №1, 1-слой
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"soil_wet_state_1"}
                            label=""
                            adornment="g/сm3"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"humidity_1"}
                            label=""
                            type={"number"}
                            adornment="%"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"soil_dry_state_1"}
                            label=""
                            adornment="g/сm3"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"max_density_soil_1"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"coefficient_1"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"requirement_1"}
                            label=""
                            adornment="Куп"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"conclusion_1"}
                            label="Вывод"
                            control={control}
                        />
                    </Grid>

                    <Grid
                        size={2}
                        padding={1}
                        sx={{alignContent: 'center'}}
                    >
                        Точка №1, 1-слой
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"soil_wet_state_2"}
                            label=""
                            adornment="g/сm3"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"humidity_2"}
                            label=""
                            type={"number"}
                            adornment="%"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"soil_dry_state_2"}
                            label=""
                            adornment="g/сm3"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"max_density_soil_2"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"coefficient_2"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={1}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"requirement_2"}
                            label=""
                            adornment="Куп"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"conclusion_2"}
                            label="Вывод"
                            control={control}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}