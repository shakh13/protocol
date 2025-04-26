import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MyTextareaField from "../../../components/forms/MyTextareaField.jsx";
import {useEffect, useState} from "react";

export default function ProtocolForm(props) {
    const {control, settings} = props;
    
    return (
        <Box sx={{marginTop: "15px"}}>
            <Typography
                variant="body1"
                component="div"
                color={"textSecondary"}
                sx={{marginY: 'auto'}}
            >
                Результаты испытаний
            </Typography>
            {
                settings !== null && (
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
                        columns={{xs: 190, sm: 190, md: 190, lg: 190, xl: 190}}
                    >
                        {
                            settings.headers.map((header, i) => {
                                    return (
                                        <Grid
                                            key={"protocol_table_" + i}
                                            size={settings.col_widths[i]}
                                            padding={1}
                                            textAlign='center'
                                            alignContent="center"
                                        >
                                            {header}
                                        </Grid>
                                    )
                                }
                            )
                        }

                        {
                            settings.fields.map((field, i) => {
                                    return field.map((col, j) => {
                                            let content = null;
                                            if (col['type'] === 'i') {
                                                content = i + 1;
                                            } else if (col['type'] === 'text') {
                                                content = col['label'];
                                            } else if (col['type'] === 'text_field') {
                                                content = (
                                                    <MyTextField
                                                        name={col['name']}
                                                        label={col['label']}
                                                        adornment={col['adornment']}
                                                        control={control}
                                                    />
                                                );
                                            } else if (col['type'] === 'date_field') {
                                                content = (
                                                    <MyDatePickerField
                                                        name={col['name']}
                                                        label="Дата"
                                                        control={control}
                                                    />
                                                );
                                            } else if (col['type'] === 'number_field') {
                                                content = (
                                                    <MyTextField
                                                        name={col['name']}
                                                        type={"number"}
                                                        label=""
                                                        adornment={col['adornment']}
                                                        control={control}
                                                    />
                                                );
                                            } else if (col['type'] === 'textarea_field') {
                                                content = (
                                                    <MyTextareaField
                                                        name={col['name']}
                                                        label={col['label']}
                                                        control={control}/>
                                                );
                                            }

                                            return (
                                                <Grid
                                                    key={"protocol_table_" + i + "_" + j}
                                                    size={settings.col_widths[j]}
                                                    padding={1}
                                                    textAlign='center'
                                                    alignContent="center"
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
                )
            }
        </Box>
    )
}