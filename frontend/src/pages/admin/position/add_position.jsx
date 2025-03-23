import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import MySelectField from "../../../components/forms/MySelectField.jsx";
import MyMultiSelectField from "../../../components/forms/MyMultiSelectField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useState, useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage.jsx";
import AxiosInstance from "../../../components/axios_instance.jsx";


export default function AddPosition(props) {
    const {open, setOpen, updateData} = props;
    const [addError, setAddError] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup.object({
        name: yup.string().required("Введите название должности"),
    })

    const {control, handleSubmit, watch} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = (data) => {
        setAddError(false);
        AxiosInstance.post("positions/", {
            name: data.name,
        })
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                setAddError(true);
                console.log(error);
            });
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-describedby="scroll-dialog-description"
            aria-labelledby="responsive-dialog-title"
        >
            <Container maxWidth="sm" sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                <DialogTitle id="responsive-dialog-title">
                    {"Добавить должность"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}
                      style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <DialogContent>
                        <MyTextField name="name" label="Название" type="text" control={control}/>
                        {addError && <ErrorMessage message={"Ошибка добавления должность"}/>}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" autoFocus type={"submit"}>
                            Сохранить
                        </Button>
                        <Button type={"button"} autoFocus onClick={handleClose}>
                            Отмена
                        </Button>
                    </DialogActions>
                </form>
            </Container>
        </Dialog>
    );
}