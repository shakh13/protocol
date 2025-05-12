import {useEffect, useState} from "react";
import AxiosInstance from "../../components/axios_instance.jsx";
import {Container, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import Waiting from "../../components/Waiting.jsx";
import * as React from "react";
import NoData from "../../components/NoData.jsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";

export default function ClientsPage() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState("");


    function getData() {
        setLoading(true);
        AxiosInstance.get("me")
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                Swal.fire({
                    title: error,
                    icon: "error",
                });
            });
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            <Box sx={{
                display: 'flex',
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{padding: '0 10px', marginY: 'auto'}}
                >
                    Заказчики
                </Typography>
                <TextField
                    id="search_clients_field"
                    label="Поиск"
                    variant="outlined"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: '100px',
                        width: '300px',
                        margin: 'auto 0 auto auto',
                    }}
                />
            </Box>
            {
                loading
                    ? <Waiting/>
                    : <>
                        <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                            {user.clients.length === 0 && <NoData/>}
                            {
                                user.clients
                                    .filter((client) => client.name.toLowerCase().search(searchFilter.toLowerCase()) > -1)
                                    .map((client, index) => (
                                        <div key={"client_" + client.id}>
                                            <ListItem alignItems="flex-start"
                                                      sx={{padding: "8px 0"}}
                                            >
                                                <ListItemAvatar sx={{marginY: 'auto'}}>
                                                    <Typography component="div">{client.id}</Typography>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={(
                                                        <Link href={"/client/" + client.id} underline="none">
                                                            {client.name}
                                                        </Link>
                                                    )}
                                                    secondary={client.address}
                                                />

                                            </ListItem>
                                            {index !== user.clients.length - 1 &&
                                                <Divider/>
                                            }
                                        </div>
                                    ))
                            }
                        </List>
                    </>
            }
        </Container>
    )
}