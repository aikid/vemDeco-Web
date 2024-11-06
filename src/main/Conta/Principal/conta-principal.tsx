import React, { useState, useEffect } from "react";
import { Alert, Divider, FormControl, Grid, MenuItem, Select, Snackbar, Typography } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PhoneInput } from 'react-international-phone';
import { useAuth } from "../../../context/AuthContext";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import NavBar from "../../../utils/navbar/navbar";
import "./conta-principal.css";
import ValidationHelper from "../../../helpers/validationHelper";
import ResumoRapidoService from "../../../Service/resumo-rapido-service";
import { Estado, UserData, AddressData } from "../../../interfaces/userEdit.interfaces";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";

const ContaPrincipal = () => {
    const [userLoggedData, setUserLoggedData] = useState<UserData>();
    const [addressData, setAddressData] = useState<AddressData>();
    const [estados, setEstados] = useState<Estado[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [disableInput, setDisableInput] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    let navigate = useNavigate();
    

    const { register, handleSubmit, formState:{errors}, control, reset, setValue, watch } = useForm({
        defaultValues: {
            name:"",
            surname:"",
            email:"",
            phone:"",
            secondPhone:"",
            type:"",
            document:"",
            birthdate: null,
            occupation:"",
            state:"",
            city:"",
            zipCode:"",
            address:"",
            neighborhood:"",
            number:"",
            complement:""
        },      
    });

    const { user } = useAuth();

    const updateProfile = async(data: any) => {
        if (data.birthdate && dayjs.isDayjs(data.birthdate)) {
            data.birthdate = data.birthdate.format('YYYY-MM-DD');
        }

        try {
            await ResumoRapidoService.updateUserProfile(data, user.token)
            setOpen(true);
        }catch (e){
            console.log('Erro encontrado:', e);
        }
    }

    const getBrazilStates = async (token: string) => {
        try{
            let response = await ResumoRapidoService.getStates(token);
            if(response && response.data){
                const estadosOrdenados = response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
                setEstados(estadosOrdenados);
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
    }

    const handleCepBlur = async (event: any) => {
        const cepValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (cepValue.length === 8) {
          setDisableInput(true);
          try {
            const address = await ResumoRapidoService.getAddressByCep(cepValue);
            if (address.uf) {
              setAddressData(address);
              const state = estados.find((s) => s.sigla === address.uf);
              console.log('Estado: ', state);
              if(state){
                setValue('state', state.sigla);
                setValue('city', address.localidade);
                setValue('address', address.logradouro);
                setValue('neighborhood', address.bairro);
                setDisableInput(false);
              }
            }
          } catch (error) {
            console.error('Erro ao buscar CEP:', error);
          } finally {
            setDisableInput(false);
          }
        }
      };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    

    useEffect(()=>{
        const getUserInfo = async(): Promise<void> =>{
            try{
                if(user){
                    let response = await ResumoRapidoService.getUserInfo(user.token);
                    if(response && response.data){
                        setUserLoggedData(response.data);
                        reset(response.data);
                    }
                    getBrazilStates(user.token);
                }
            }catch (e){
                console.log('Erro encontrado:', e);
            }
        }

        getUserInfo();
    },[reset])

    useEffect(() => {
        // Preencher os dados do usuário ao carregar
        if (userLoggedData) {
            
            if (userLoggedData.state) {
                setValue("state", userLoggedData.state);
            }
        }
    }, [userLoggedData]);

    return(
        <DashboardLayout title="Configuração">
            <div className="confMenu">
                <a className="active" href="/conta">Conta</a>
                <a href="/historico">Consumo</a>
            </div>
            <form onSubmit={handleSubmit((data)=>{updateProfile(data)})}>
                <Grid className="gridPersonal">
                    <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}> 
                        Informações pessoais
                    </Grid>
                    <Divider style={{width:"100%"}}/>
                        <Grid margin={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-BR">
                                <Grid container spacing={3} sx={{ mt: "15px" }}>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="typography">Nome</Typography>
                                        <input {...register("name", {required: 'O Nome é obrigatório'})} className="inputMain" type="text"/>
                                        <p className="errorMsg">{errors.name?.message?.toString()}</p>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="typography">E-mail</Typography>
                                        <input {...register("email", {required: 'O E-mail é obrigatório', validate: value => ValidationHelper.validarEmail(value) || "E-mail inválido"})} className="inputMain" type="text"/>
                                        <p className="errorMsg">{errors.email?.message?.toString()}</p>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <Typography className="typography">Documento</Typography>
                                        <input {...register("document", {required: 'O Documento é obrigatório', validate: value => ValidationHelper.validarCPF(value) || "Documento inválido"})} className="inputMain"/>
                                        <p className="errorMsg">{errors.document?.message?.toString()}</p>
                                    </Grid>
                       
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <Typography>Data de Nascimento</Typography>
                                                <Controller
                                                   name="birthdate"
                                                   control={control}
                                                   rules={{ required: 'A data de nascimento é obrigatória' }}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DesktopDatePicker
                                                                {...field}
                                                                className="inputMain"
                                                                format={"DD/MM/YYYY"}
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
                                                                value={field.value ? dayjs(field.value) : null}
                                                                onChange={(date) => field.onChange(date)}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                        </FormControl>
                                        <p className="errorMsg">{errors.birthdate?.message?.toString()}</p>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Typography className="typography">Pessoa Jurídica</Typography>
                                        <FormControl fullWidth>
                                            <select {...register("type", {required: 'Selecione um tipo de pessoa'})} className="selectBox" id="meu-select">
                                                <option value="">Selecione...</option>
                                                <option value="pf">Pessoa Física</option>
                                                <option value="pj">Pessoa Jurídica</option>
                                            </select>
                                        </FormControl>
                                        <p className="errorMsg">{errors.type?.message?.toString()}</p>
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                </Grid>

                <Grid className="gridPersonal">
                    <Grid display={"flex"} fontSize={20} fontWeight={400} margin={2}> 
                        Contato
                    </Grid>
                    <Divider style={{width:"100%"}}/>
                        <Grid margin={2}>
                            <Grid container spacing={3} sx={{ mt: "15px" }}>
                                <Grid item xs={12} md={4}>
                                        <Typography className="typography">Profissão</Typography>
                                        <input {...register("occupation", {required: 'A Profissão é obrigatória'})} className="inputMain" type="text" name="occupation" id="txt-given-name" />
                                        <p className="errorMsg">{errors.occupation?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography className="typography">Celular de recados</Typography>
                                    <Controller name="phone" control={control} rules={{ required: 'O Celular é obrigatório' }} render={({ field }) => (
                                        <PhoneInput
                                            value={field.value}
                                            className="phonebox"
                                            onChange={field.onChange}
                                        />
                                    )}/>
                                    <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography className="typography">Celular de recados</Typography>
                                    <Controller name="secondPhone" control={control} render={({ field }) => (
                                        <PhoneInput
                                            value={field.value}
                                            className="phonebox"
                                            onChange={field.onChange}
                                        />
                                    )}/>
                                </Grid> 
                                <Grid item xs={12} md={3}>
                                    <Typography className="typography">CEP</Typography>
                                    <input {...register("zipCode", {required: 'O CEP é obrigatório'})} className="inputMain" type="text" name="zipCode" id="txt-given-name" disabled={disableInput} onBlur={handleCepBlur}/>
                                    <p className="errorMsg">{errors.zipCode?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography className="typography">Estado</Typography>
                                    <Controller
                                        name="state"
                                        control={control}
                                        rules={{ required: 'O Celular é obrigatório' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Estado" disabled={disableInput} fullWidth className="inputSelect" sx={{'& legend': { display: 'none' }, textAlign: "left"}}>
                                                {estados.map((estado) => (
                                                    <MenuItem key={estado._id} value={estado.sigla}>
                                                        {estado.nome}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <p className="errorMsg">{errors.state?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography className="typography">Cidade</Typography>
                                    <input {...register("city", {required: 'A Cidade é obrigatória'})} className="inputMain" type="text" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.city?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography className="typography">Endereço</Typography>
                                    <input {...register("address", {required: 'O Endereço é obrigatório'})} className="inputMain" type="text" name="address" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.address?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Typography className="typography">Número</Typography>
                                    <input {...register("number", {required: 'O Número é obrigatório'})} className="inputMain" type="text" name="number" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.number?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Typography className="typography">Complemento</Typography>
                                    <input {...register("complement", {required: 'O Complemento é obrigatório'})} className="inputMain" type="text" name="complement" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.complement?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography className="typography">Bairro</Typography>
                                    <input {...register("neighborhood", {required: 'O Bairro é obrigatório'})} className="inputMain" type="text" name="neighborhood" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.neighborhood?.message?.toString()}</p>
                                </Grid>
                            </Grid>
                        </Grid>
                </Grid>
                <div>
                    {!load ? (
                        <button className="formButton" type="submit" onClick={()=> handleSubmit}>Salvar</button>
                    ):(
                        <button className="formButton formButtonLoad" disabled>Aguarde...</button>
                    )}
                </div>
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Dado(s) editado(s) com sucesso!
                </Alert>
            </Snackbar>
        </DashboardLayout>

    )

}

export default ContaPrincipal;