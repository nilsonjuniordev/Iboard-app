import React from "react";
import { Card, CardContent, Grid } from "@mui/material";
import UserDataRh from "./UserDataRh"
import AccountDetails from "./AccountDetails"

const MyAccountRh = () => {
  

  return (
    <>
  
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
        <AccountDetails />
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
          <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
            <CardContent>             
              <UserDataRh />
            </CardContent>
          </Card>   
        </Grid>
      </Grid>
    </>
  );
};

export default MyAccountRh;
