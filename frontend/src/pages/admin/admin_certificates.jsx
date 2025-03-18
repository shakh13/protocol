import {Container, IconButton, List, ListItem, ListItemText, Skeleton, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import * as React from "react";
import AddCertificate from "./centificates/add_certificate.jsx";
import EditCertificate from "./centificates/edit_certificate.jsx";
import DeleteCertificate from "./centificates/delete_certificate.jsx";
import AxiosInstance from "../../components/axios_instance.jsx";
import NoData from "../../components/NoData.jsx";
import Waiting from "../../components/Waiting.jsx";

export default function AdminCertificates() {
    const [addCertificateOpen, setAddCertificateOpen] = useState(false);
    const [editCertificateOpen, setEditCertificateOpen] = useState(false);
    const [editCertificateId, setEditCertificateId] = useState(0);
    const [deleteCertificateOpen, setDeleteCertificateOpen] = useState(false);
    const [deleteCertificateId, setDeleteCertificateId] = useState(0);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");

    function getData() {
        setLoading(true);
        AxiosInstance.get("/certificates/").then((response) => {
            setCertificates(response.data);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            setCertificates([]);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    const handleAddCertificateOpen = () => {
        setAddCertificateOpen(true);
    };

    const handleEditCertificateOpen = (id) => () => {
        setEditCertificateId(id);
        setEditCertificateOpen(true);
    }

    const handleDeleteCertificateOpen = (id) => () => {
        setDeleteCertificateId(id);
        setDeleteCertificateOpen(true);
    }

    return (
        <Container>

            <Box sx={{
                display: 'flex',
            }}>

                <Typography variant="h6" component="div"
                            sx={{padding: '0 10px', marginY: 'auto'}}>Сертификаты</Typography>
                <Tooltip title="Добавить">
                    <IconButton
                        variant="outlined"
                        onClick={handleAddCertificateOpen}
                    >
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <TextField
                    id="search_certificates_field"
                    label="Поиск"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    sx={{
                        minWidth: '100px',
                        width: '300px',
                        margin: 'auto 0 auto auto',
                    }}
                />
            </Box>
            {loading ?
                <Waiting/>
                :
                <>
                    <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                        {certificates.length === 0 && <NoData/>}
                        {
                            certificates
                                .filter((certificate) => certificate.name.toLowerCase().search(searchFilter.toLowerCase()) > -1)
                                .map((certificate) => (
                                    <ListItem alignItems="flex-start"
                                              key={"certificate_" + certificate.id}
                                              secondaryAction={
                                                  <>
                                                      <Tooltip title="Редактировать">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Редактировать"
                                                              onClick={handleEditCertificateOpen(certificate.id)}
                                                          >
                                                              <EditIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                      <Tooltip title="Удалить">
                                                          <IconButton
                                                              edge="end"
                                                              aria-label="Удалить"
                                                              sx={{marginLeft: '15px'}}
                                                              onClick={handleDeleteCertificateOpen(certificate.id)}
                                                          >
                                                              <DeleteIcon/>
                                                          </IconButton>
                                                      </Tooltip>
                                                  </>
                                              }
                                    >
                                        <ListItemText
                                            primary={certificate.name}
                                        />

                                        <Divider variant="inset" component="div"/>
                                    </ListItem>
                                ))
                        }
                    </List>
                    {addCertificateOpen && <AddCertificate open={addCertificateOpen} setOpen={setAddCertificateOpen}
                                                           updateData={getData}/>}
                    {editCertificateOpen && <EditCertificate open={editCertificateOpen} setOpen={setEditCertificateOpen}
                                                             id={editCertificateId} updateData={getData}/>}
                    {deleteCertificateOpen &&
                        <DeleteCertificate open={deleteCertificateOpen} setOpen={setDeleteCertificateOpen}
                                           id={deleteCertificateId} updateData={getData}/>}

                </>
            }
        </Container>
    );
}