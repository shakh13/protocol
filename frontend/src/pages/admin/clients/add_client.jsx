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


export default function AddClient(props) {
    const {open, setOpen} = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const {control, handleSubmit, watch} = useForm({
        defaultValues: {
            name: '',
            address: '',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
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
                    {"Добавить заказчик"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}
                      style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <DialogContent>
                        <MyTextField name="name" label="Название" type="text" control={control}/>
                        <MyTextField name="address" label="Адрес" type="address" control={control}/>
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