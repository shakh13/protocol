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
import Swal from "sweetalert2";

export default function DeleteEmployeeClient(props) {
    const {open, setOpen, id, updateData, employee} = props;
    const [client, setClient] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    function getData() {
        AxiosInstance.get("clients/" + id + "/")
            .then((response) => {
                setClient(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    useEffect(() => {
        getData();
    }, []);


    const handleDelete = () => {
        AxiosInstance.post(`users/${employee}/remove-client/`, {
            client_id: id,
        })
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {loading
                ? <Waiting/>
                : <>
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
                        <Button onClick={handleClose} autoFocus>
                            Нет
                        </Button>
                    </DialogActions>
                </>
            }
        </Dialog>
    );
}