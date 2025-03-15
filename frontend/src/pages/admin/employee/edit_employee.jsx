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
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useForm} from "react-hook-form";

const options = [
    {value: 'chocolate', label: 'Chocolate'},
    {value: 'strawberry', label: 'Strawberry'},
    {value: 'vanilla', label: 'Vanilla'}
]

export default function EditEmployee(props) {
    const {open, setOpen, id} = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const {control, handleSubmit, watch} = useForm({
        defaultValues: {
            name: '',
            email: '',
            position: {value: 'chocolate', label: 'Chocolate'},
        },
    });

    const onSubmit = (data) => {
        console.log("Selected:", data);
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
                    {"Редактировать сотрудника"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}
                      style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <DialogContent>
                        <MyTextField name="name" label="Полное имя" type="text" control={control}/>
                        <MyTextField name="email" label="Email" type="email" control={control}/>
                        <MySelectField name={"position"} label={"Должность"} options={options} control={control}/>
                        <MyMultiSelectField name={"clients"} label={"Заказчики"} options={options}
                                            control={control}/>
                        <MyMultiSelectField name={"buildings"} label={"Объекты"} options={options}
                                            control={control}/>
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