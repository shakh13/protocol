import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";

export default function OnixShmidt(props) {
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
                        Наименование продукции
                        <br/>
                        Product name
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Проект. класс бетона,
                        <br/>
                        Project class of concrete
                        <br/>
                        Внорм, MPa
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Дата бетонирования
                        <br/>
                        Date of concreting
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Фактический класс прочности бетона
                        <br/>
                        Actual strength class of concrete
                        <br/>
                        Вф, МPa
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Набрал в % от проектного класса
                        <br/>
                        Scored in % of the project class
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Выводы
                        <br/>
                        Conclusions
                    </Grid>

                    <Grid
                        size={2}
                        padding={1}
                    >
                        Бетонирование монолитного фундамента (А-В/4-8)
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"beton_class_1"}
                            label="Внорм, MPa"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyDatePickerField
                            name={"date_1"}
                            label="Дата"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"strength_class_1"}
                            label="Вф, МPa"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"percent_1"}
                            type={"number"}
                            label="%"
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
                    >
                        Бетонирование монолитного фундамента (А-В/4-8)
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"beton_class_2"}
                            label="Внорм, MPa"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyDatePickerField
                            name={"date_2"}
                            label="Дата"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"strength_class_2"}
                            label="Вф, МPa"
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"percent_2"}
                            type={"number"}
                            label="%"
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