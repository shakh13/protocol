import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import AxiosInstance from "../../../components/axios_instance.jsx";

export default function DeleteProtocol(props) {
    const {open, setOpen, protocol, updateData} = props;
    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        AxiosInstance.delete(`delete_protocol/${protocol.id}`).then((response) => {
            updateData();
        });
        setOpen(false);
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogTitle id="alert-dialog-title">
                {"Удаление"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Вы действительно хотите удалить протокол {protocol.id}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error">Да</Button>
                <Button onClick={handleClose} autoFocus>Нет</Button>
            </DialogActions>

        </Dialog>
    )
}