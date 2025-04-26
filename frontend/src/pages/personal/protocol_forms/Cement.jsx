import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MyTextareaField from "../../../components/forms/MyTextareaField.jsx";

export default function Cement(props) {
    const {control} = props;


    return (
        <>
            <Box sx={{marginTop: "15px"}}>
                <Typography
                    variant="body1"
                    component="div"
                    color={"textSecondary"}
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
                        size={3}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Вид испытаний
                        <br/>
                        Type of test
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Метод испытаний, пункт НД
                        <br/>
                        Test method, RD clause
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Значения требований по НД
                        <br/>
                        Values of requirements according to RD
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Фактическое значение
                        <br/>
                        Actual value
                    </Grid>
                    <Grid
                        size={3}
                        padding={1}
                        textAlign='center'
                        alignContent="center"
                    >
                        Выводы
                        <br/>
                        Conclusions
                    </Grid>

                    <Grid
                        size={3}
                        padding={1}
                    >
                        Прочность на сжатие, МPa, в возрасте 2/7/28 сут
                        <br/>
                        Compressive strength, MPa, at the age of 2/7/28 days
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"test_method_1"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextareaField
                            name={"value_requirements_1"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextareaField
                            name={"actual_value_1"}
                            label=""
                            control={control}
                        />
                    </Grid>
                    <Grid
                        size={3}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"conclusion_1"}
                            label="Вывод"
                            control={control}
                        />
                    </Grid>

                </Grid>
            </Box>


        </>
    )
}