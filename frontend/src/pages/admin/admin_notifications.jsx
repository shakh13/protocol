import {Avatar, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {cloneElement} from "react";
import {Cancel, Close, Done, Padding, RemoveRedEye} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

function generate(element) {
    return [0, 1, 2, 3, 4].map((value) =>
        cloneElement(element, {
            key: value,
        }),
    );
}

export default function AdminNotifications() {
    return (
        <Container>
            <Typography variant={"h6"} component={"div"}>Уведомление</Typography>
            <List sx={{width: '100%', minWidth: 360, bgcolor: 'background.paper'}}>
                {generate(
                    <>
                        <ListItem alignItems="flex-start"
                                  sx={{padding: "8px 0"}}
                                  secondaryAction={
                                      <>
                                          <Tooltip title="Отказатся">
                                              <IconButton
                                                  edge="end"
                                                  aria-label="Отказатся"
                                              >
                                                  <Close/>
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Разрешить">
                                              <IconButton
                                                  sx={{marginLeft: '15px'}}
                                                  edge="end"
                                                  aria-label="Разрешить"
                                                  variant="contained"
                                              >
                                                  <Done/>
                                              </IconButton>
                                          </Tooltip>
                                      </>
                                  }
                        >

                            <ListItemAvatar sx={{marginY: 'auto'}}>
                                <Typography component="div">12345</Typography>
                            </ListItemAvatar>
                            <ListItemText
                                primary={(<Link href="/admin/protocol/1" underline="none">Название объекта</Link>)}
                                secondary={(<Link href="/admin/employee/1" underline="none">Shaxzod Saidmurodov</Link>)}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </>
                )}
            </List>
        </Container>
    );
}