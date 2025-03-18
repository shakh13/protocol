import React, {useEffect} from 'react';
import {extendTheme} from '@mui/material/styles';
import LayersIcon from '@mui/icons-material/Layers';
import {AppProvider} from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import {PageContainer} from "@toolpad/core";
import {CardMembership, People, Settings, Task, Work} from "@mui/icons-material";
import AxiosInstance from "./axios_instance.jsx";


const admin_navigation = [
    {
        segment: 'admin/',
        title: 'Запросы на редактирование',
        icon: <Task/>,
        badge: "2",
    },
    {
        segment: 'admin/employees/',
        title: 'Сотрудники',
        icon: <People/>,
    },
    {
        segment: 'admin/positions/',
        title: 'Должности',
        icon: <Work/>,
    },
    {
        kind: 'divider',
    },
    {
        segment: 'admin/protocols/',
        title: 'Все протоколы',
        icon: <LayersIcon/>,
    },
    {
        kind: 'divider',
    },
    {
        segment: 'admin/clients/',
        title: 'Заказчики',
        icon: <PersonIcon/>,
    },
    {
        kind: 'divider',
    },
    {
        segment: "admin/machines/",
        title: "Оборудование",
        icon: <PrecisionManufacturingIcon/>,
    },
    {
        segment: "admin/certificates/",
        title: "Сертификаты",
        icon: <CardMembership/>,
    },
    {
        kind: 'divider',
    },
    {
        segment: "admin/settings/",
        title: "Настройки",
        icon: <Settings/>,
    },
]

const personal_navigation = [
    {
        segment: 'customers/',
        title: 'Заказчики',
        icon: <PersonIcon/>,
    },
    {
        segment: 'buildings/',
        title: 'Объекты',
        icon: <ApartmentIcon/>,
    },
    {
        kind: 'divider',
    },
    {
        segment: 'protocols/',
        title: 'Протоколы',
        icon: <LayersIcon/>,
    },
    {
        segment: 'requests/',
        title: 'Запросы на редактирование',
        icon: <GppMaybeIcon/>,
    },
];


export default function Navbar(props) {
    const {content, noNavBar} = props;
    const [isAdmin, setIsAdmin] = React.useState(null);

    useEffect(() => {
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, []);

    const [session, setSession] = React.useState({
        user: {
            name: localStorage.getItem('fullname'),
            email: localStorage.getItem('email'),
            token: localStorage.getItem('token'),
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signOut: () => {
                AxiosInstance.post('logoutall').then((res) => {
                    localStorage.clear();
                    window.location.href = '/';
                    setSession(null);
                }).catch((err) => {
                    console.log(err);
                });
            },
        };
    }, []);


    const theme = extendTheme({
        colors: {},
        colorSchemes: {
            dark: true,
            light: true,

        },
        colorSchemeSelector: 'class',
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 600,
                lg: 1200,
                xl: 1536,
            },
        },
    });

    const branding = {
        title: 'RTC Test',
        logo: <img src="/assets/logo.png" alt="Logo"/>,
        homeUrl: isAdmin ? '/admin' : '/protocols',
    }


    const currentNavigation = isAdmin ? admin_navigation : personal_navigation;

    // function CustomAppTitle() {
    //     return (
    //         <Stack direction={"row"} alignItems={"center"} spacing={2}>
    //             <img src="/assets/logo.png" alt="Logo" height={"40vdh"}/>
    //             <Typography variant="h6">myProtocol</Typography>
    //         </Stack>
    //     );
    // }


    return (
        <>
            {noNavBar ? content :
                <AppProvider theme={theme}
                             branding={branding}
                             navigation={currentNavigation}
                             session={session}
                             authentication={authentication}
                >
                    <DashboardLayout
                        slots={{
                            // appTitle: CustomAppTitle,
                        }}
                    >
                        <PageContainer>{content}</PageContainer>
                    </DashboardLayout>
                </AppProvider>
            }
        </>
    );
}
