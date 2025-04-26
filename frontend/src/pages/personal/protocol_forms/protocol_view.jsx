import Grid from "@mui/material/Grid2";
import MyDatePickerField from "../../../components/forms/MyDatePickerField.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MyTextareaField from "../../../components/forms/MyTextareaField.jsx";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import Waiting from "../../../components/Waiting.jsx";

export default function ProtocolView(props) {
    const {protocol} = props;
    const [settings, setSettings] = useState({});
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    function getData() {
        setLoading(true);
        setSettings(JSON.parse(protocol.type.settings));
        setData(JSON.parse(protocol.data));
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box>
            {loading
                ? <Waiting/>
                : <Box sx={{marginTop: "15px"}}>
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
                                            } else if (
                                                col['type'] === 'text_field'
                                                || col['type'] === 'number_field'
                                                || col['type'] === 'textarea_field'
                                            ) {
                                                if (col['name'] in data) {
                                                    content = data[col['name']];
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
        </Box>
    )
}