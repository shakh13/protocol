import React from 'react';
import {extendTheme} from '@mui/material/styles';
import LayersIcon from '@mui/icons-material/Layers';
import {AppProvider} from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import {PageContainer} from "@toolpad/core";
import {CardMembership, Notifications, People, Settings, Work} from "@mui/icons-material";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

const admin_navigation = [
    {
        segment: 'admin/',
        title: 'Уведомления',
        icon: <Notifications/>,
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
        segment: 'admin/buildings/',
        title: 'Объекты',
        icon: <ApartmentIcon/>,
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
    const {content, role} = props;
    const pathname = location.pathname;

    const [session, setSession] = React.useState({
        user: {
            name: 'Shaxzod Saidmurodov',
            email: 'vip.shaxi@gmail.com',
            token: localStorage.getItem('token'),
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Shaxzod Saidmurodov',
                        email: 'vip.shaxi@gmail.com',
                        token: localStorage.getItem('token'),
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);


    const theme = extendTheme({
        colors: {},
        colorSchemes: {
            dark: true,
            light: true,
            // light: {
            //     palette: {
            //         // background: {
            //         //     default: '#F9F9FE',
            //         //     paper: '#EEEEF9',
            //         // },
            //         primary: {
            //             main: '#555'
            //         },
            //         secondary: {
            //             main: '#999'
            //         }
            //     },
            // },
        },
        colorSchemeSelector: 'class',
        // cssVariables: {
        //     colorSchemeSelector: 'data-toolpad-color-scheme',
        // },
        // colorSchemes: {
        //     light: {
        //         palette: {
        //             background: {
        //                 default: '#F9F9FE',
        //                 paper: '#EEEEF9',
        //             },
        //         },
        //     },
        //     dark: {
        //         palette: {
        //             background: {
        //                 default: '#2A4364',
        //                 paper: '#112E4D',
        //             },
        //         },
        //     },
        // },
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
        title: 'myProtocol',
        logo: <img src="/assets/logo.png" alt="Logo"/>,
        homeUrl: role === 'admin' ? '/admin' : '/protocols',
    }


    const currentNavigation = role === "admin" ? admin_navigation : personal_navigation;


    function CustomAppTitle() {
        return (
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <img src="/assets/logo.png" alt="Logo" height={"40vdh"}/>
                <Typography variant="h6">myProtocol</Typography>
            </Stack>
        );
    }


    return (
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
    );
}
