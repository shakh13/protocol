import {Container} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MyTextField from "../../../components/forms/MyTextField.jsx";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useState, useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";
import AxiosInstance from "../../../components/axios_instance.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";


export default function EditPosition(props) {
    const {open, setOpen, id, updateData} = props;
    const [loading, setLoading] = useState(true);
    const [editError, setEditError] = useState(false);

    function getData() {
        setLoading(true);
        AxiosInstance.get("positions/" + id + "/")
            .then((response) => {
                setValue("name", response.data.name);
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

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const schema = yup.object({
        name: yup.string().required("Введите название должности"),
    })

    const {control, handleSubmit, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = (data) => {
        setEditError(false);
        AxiosInstance.put("positions/" + id + "/", {
            name: data.name,
        })
            .then((response) => {
                updateData();
                setOpen(false);
            })
            .catch((error) => {
                setEditError(true);
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
                    {"Редактировать должность"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}
                      style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <DialogContent>
                        <MyTextField name="name" label="Название" type="text" control={control}/>
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