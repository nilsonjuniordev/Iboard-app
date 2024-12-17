import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import AccountCircle from "@mui/icons-material/AccountCircle";
import Divider from '@mui/material/Divider';

const AccountDetails = () => {
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        fetch(`/api/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setUserName(data.nome);
                setUserId(data.iduser);
                setUserEmail(data.email);
            })
            .catch((error) => {
                console.error("Erro ao obter dados do usuário:", error);
            });
    }, []);

    const getInitials = (name) => {
        if (!name) return "";
        const nameParts = name.split(" ");
        const initials = nameParts.map(part => part[0]).join("");
        return initials;
    };

    return (
        <>
            <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <div>
                            <Avatar sx={{ bgcolor: '#6A438B', height: '60px', width: '60px', fontSize: '24px' }}>
                                {userName ? getInitials(userName) : <AccountCircle />}
                            </Avatar>
                        </div>
                        <Stack spacing={1} sx={{ textAlign: 'center' }}>
                            <Typography variant="h5">{userName || "Visitante"}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              Id:  {userId || "ID não disponível"}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                               {userEmail || "Email não disponível"}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions>
                    <Typography color="text.secondary" variant="body2">
                        Iborad V1.0.1
                    </Typography>
                </CardActions>
            </Card>
        </>
    );
};

export default AccountDetails;
