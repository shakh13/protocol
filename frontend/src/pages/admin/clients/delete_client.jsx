import * as React from 'react';
import {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import AxiosInstance from "../../../components/axios_instance.jsx";
import Waiting from "../../../components/Waiting.jsx";

export default function DeleteClient(props) {
    const {open, setOpen, id, updateData} = props;
    const [client, setClient] = React.useState({});
    const [loading, setLoading] = useState(true);

    function getData() {
        setLoading(true);

        AxiosInstance.get("clients/" + id + "/").then((response) => {
            setClient(response.data);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getData();
    }, []);


    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        AxiosInstance.delete(`clients/${id}/`).then((response) => {
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
            {
                loading ?
                    <Waiting/>
                    :
                    <>
                        <DialogTitle id="alert-dialog-title">
                            {"Удаление"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Вы действительно хотите удалить {client.name}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDelete} color="error">Да</Button>
                            <Button onClick={handleClose} autoFocus>Нет</Button>
                        </DialogActions>
                    </>
            }
        </Dialog>
    );
}