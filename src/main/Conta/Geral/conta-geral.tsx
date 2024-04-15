import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import moment from "moment";
  import dayjs from "dayjs";
  import "dayjs/locale/pt-br";
import { IUpdateUserProfileRequest } from "../../../model/user/update-user-profile-request";
import "./conta-geral.css";
import InputMask from 'react-input-mask';
import { BorderAll } from "@mui/icons-material";



export default function ContaGeral() {
    const [userProfileRequest, setUserProfileRequest] =
      useState<IUpdateUserProfileRequest>({
        sex: "",
      } as IUpdateUserProfileRequest);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  
  
    const updateDataProfile = () => {
      (async () => {
        // baseModel.showLoading({ open: true });
        // await UserAppService.updateProfile(userProfileRequest);
        // baseModel.showLoading({ open: false });
  
        // baseModel.showMessage({
        //   message: "Informações salvas com sucesso!",
        //   open: true,
        //   type: "success",
        // });
        // window.location.href = `/user/profile`;
        // closeTrigger(false);
      })();
    };
  
    const handleOnChange = (e: any) => {
      let givenName = userProfileRequest.givenName;
      let familyName = userProfileRequest.familyName;
      let phoneNumber = userProfileRequest.phoneNumber;
      let whatsAppNumber = userProfileRequest.whatsAppNumber;
      let document = userProfileRequest.document;
      let sex = userProfileRequest.sex;
  
      if (e.target.name === "txt-given-name") {
        givenName = e.target.value;
      } else if (e.target.name === "txt-family-name") {
        familyName = e.target.value;
      } else if (e.target.name === "txt-document") {
        document = e.target.value;
      } else if (e.target.name === "txt-phone-number") {
        phoneNumber = e.target.value;
      } else if (e.target.name === "txt-whatsapp-number") {
        whatsAppNumber = e.target.value;
      } else if (e.target.name === "select-sex") {
        sex = e.target.value;
      }
  
      setUserProfileRequest((prevState) => {
        return {
          ...prevState,
          givenName,
          familyName,
          document,
          phoneNumber,
          whatsAppNumber,
          sex,
        };
      });
  
      setBtnDisabled(false);
    };
  
    const addInput = () => (
      <TextField
        id="txt-document"
        name="txt-document"
        onChange={handleOnChange}
        label="CPF"
        fullWidth={true}
        value={userProfileRequest?.document}
      />
    );
  
    return (
      <React.Fragment>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-BR">
          <Grid  container spacing={3} sx={{ mt: "15px" }}>
            <Grid item xs={12} md={6}>
              <Typography className="typography">Nome</Typography>
              <input 
                className="inputMain" 
                type="text" 
                name="Nome" 
                id="txt-given-name" 
                defaultValue={userProfileRequest?.givenName} 
                onChange={handleOnChange}
              />
            
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className="typography">Sobrenome</Typography>
               <input 
                className="inputMain"
                name="Sobrenome"
                defaultValue={userProfileRequest?.familyName} 
                id="txt-family-name"
                onChange={handleOnChange}
                />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography className="typography">CPF</Typography>
                <InputMask 
                mask = "999.999.999-99"
                maskChar="_"
                className="inputMain"
                name="E-mail"
                defaultValue={userProfileRequest?.document} 
                id="txt-email"
                onChange={handleOnChange}
                />
            </Grid>
  
            <Grid item xs={12} md={4}>
              
              <FormControl
                fullWidth
              >
                <Typography>
                Data de Nascimento
                </Typography>
                <DesktopDatePicker
                
                className="inputMain"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#C1C3C7',
                      borderRadius:2,
                      height: "50px",
                      marginTop:"5px"
                    },
                    '&:hover fieldset': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black',
                    },
                    '& legend': { display: 'none' }
                  },
                }}
                  value={
                    userProfileRequest?.birthDate !== undefined
                      ? dayjs(userProfileRequest.birthDate)
                      : null
                  }
                  format={"DD/MM/YYYY"}
                  onChange={(newValue) => {
                    setBtnDisabled(false);
                    let newDate = newValue as moment.Moment;
                    let birthDate = newDate.format("YYYY-MM-DD");
                    setUserProfileRequest((prevState) => {
                      return { ...prevState, birthDate };
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className = "typography"> Pessoa Jurídica </Typography>
              <FormControl
                fullWidth
              >
                <Select
                  id="select-sex"
                  name="select-sex"
                  label="Sexo"
                  fullWidth
                  value={userProfileRequest?.sex}
                  onChange={handleOnChange}
                  className="inputMain"
                  sx={{
                      '& legend': { display: 'none' }
                  
                  }}
                >
                  <MenuItem value={"S"}>Sim</MenuItem>
                  <MenuItem value={"N"}>Não</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            xs={12}
            spacing={2}
            textAlign={"left"}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Grid item>
              <Button
               
              />
            </Grid>
            <Grid item>
              <Button
                
              />
            </Grid>
          </Grid>
          <Grid
            xs={12}
            spacing={2}
            textAlign={"left"}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <Button
             
            />
          </Grid>
        </LocalizationProvider>
      </React.Fragment>
    );
}
  