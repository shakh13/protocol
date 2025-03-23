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

export default function DeleteEmployee(props) {
    const {open, setOpen, id, updateData} = props;
    const [employee, setEmployee] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    function getData() {
        AxiosInstance.get("users/" + id + "/")
            .then((response) => {
                setEmployee(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(true);
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, []);


    const handleDelete = () => {
        AxiosInstance.delete(`users/${id}/`)
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                console.log(error);
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
                            Вы действительно хотите удалить {employee.fullname}?
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