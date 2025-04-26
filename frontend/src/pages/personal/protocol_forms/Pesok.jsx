import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MyTextareaField from "../../../components/forms/MyTextareaField.jsx";

export default function Pesok(props) {
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
                        Зерновой состав, проходы, через сито, % по массе
                        <br/>
                        Grain composition, passes, through a sieve, % by weight:
                        <br/>
                        - 2,5 mm;
                        <br/>
                        - d mm;
                        <br/>
                        - 0,5(d+D) mm;
                        <br/>
                        - D mm;
                        <br/>
                        - 1,25D.
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

                    <Grid
                        size={3}
                        padding={1}
                    >
                        Содержание дробленных зерен, % по массе:
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"test_method_2"}
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
                            name={"value_requirements_2"}
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
                            name={"actual_value_2"}
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
                            name={"conclusion_2"}
                            label="Вывод"
                            control={control}
                        />
                    </Grid>

                    <Grid
                        size={3}
                        padding={1}
                    >
                        Содержание зерен пластинчатой и игловатой формы, % по массе
                        <br/>
                        Content of lamellar and needle-shaped grains, % by weight
                        <br/>
                        - группа щебня
                        <br/>
                        - group of crushed stone
                    </Grid>
                    <Grid
                        size={2}
                        padding={1}
                        alignContent="center"
                    >
                        <MyTextField
                            name={"test_method_3"}
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
                            name={"value_requirements_3"}
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
                            name={"actual_value_3"}
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
                            name={"conclusion_3"}
                            label="Вывод"
                            control={control}
                        />
                    </Grid>

                </Grid>
            </Box>


        </>
    )
}