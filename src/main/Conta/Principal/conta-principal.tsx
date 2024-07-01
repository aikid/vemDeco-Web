import React, { useState, useEffect } from "react";
import { Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PhoneInput } from 'react-international-phone';
import InputMask from 'react-input-mask';
import { useNavigate } from "react-router-dom";
import NavBar from "../../../utils/navbar/navbar";
import "./conta-principal.css";
import ValidationHelper from "../../../helpers/validationHelper";
import ResumoRapidoService from "../../../Service/resumo-rapido-service";
import { Cidade, Estado, UserData } from "../../../interfaces/userEdit.interfaces";

const ContaPrincipal = () => {
    const [userLoggedData, setUserLoggedData] = useState<UserData>();
    const [estados, setEstados] = useState<Estado[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [disableCityInput, setDisableCityInput] = useState<boolean>(true);
    const [disableInput, setDisableInput] = useState<boolean>(false);
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
            birthdate:"",
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

    const cep = watch('zipCode');

    const updateProfile = async(data: any) => {
        console.log('Dados do formulário: ', data);
    }

    const getBrazilStates = async () => {
        try{
            let response = await ResumoRapidoService.getStates();
            if(response && response.data){
                const estadosOrdenados = response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
                setEstados(estadosOrdenados);
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
    }

    const getBrazilCitiesByState = async (stateId: string) => {
        try{
            let response = await ResumoRapidoService.getCities(stateId);
            if(response && response.data){
                console.log('Dados da cidade: ', response.data);
                const cidadesOrdenadas = response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
                setCidades(cidadesOrdenadas);
                setDisableCityInput(false);
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
              const state = estados.find((s) => s.sigla === address.uf);
              //@ts-ignore
              setValue('state', state.nome);
              //@ts-ignore
              const citiesData = await ResumoRapidoService.getCities(state.id);
              setCidades(citiesData.data);
              console.log('Cidade: ', cidades);
              const city = cidades.find((c) => c.nome === address.localidade);
              //@ts-ignore
              console.log('Cidade Encontrada: ', city);
              //@ts-ignore
              if(city){
                setValue('city', city.nome);
              }
              setValue('address', address.logradouro);
              setValue('neighborhood', address.bairro);
              setDisableInput(false);
            }
          } catch (error) {
            console.error('Erro ao buscar CEP:', error);
          } finally {
            setDisableInput(false);
          }
        }
      };
    
    //máscara condicional com DDI
    const getMask = (value: string): string => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue.length > 12 ? '+99 (99) 99999-9999' : '+99 (99) 9999-9999';
    };

    const getUserInfo = async(): Promise<void> =>{
        try{
            const token = localStorage.getItem("userToken")
            if(token){
                let response = await ResumoRapidoService.getUserInfo(token);
                if(response && response.data){
                    reset(response.data);
                }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
    }

    const handleChangeCity = (event: any) => {
        getBrazilCitiesByState(event.target.value);
    };

    useEffect(()=>{
        getUserInfo();
        getBrazilStates();
    },[])

    return(
        <div>
            <NavBar/>
            <Grid display={"flex"} style={{paddingTop:"80px"} }>
                {/* <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>
                <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>
                <Typography marginRight={"20px"}marginLeft={"20px"}>Sua conta</Typography>  */}
            </Grid>
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
                                                    <DesktopDatePicker className="inputMain"
                                                        {...field}
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
                                                        format={"DD/MM/YYYY"}
                                                    />
                                                )} />
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
                                        <input {...register("occupation", {required: 'A Profissão é obrigatória'})} className="inputMain" type="text" name="profissao" id="txt-given-name" />
                                        <p className="errorMsg">{errors.occupation?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography className="typography">Celular de recados</Typography>
                                    <PhoneInput {...register("phone", {required: 'O Celular é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                                    <p className="errorMsg">{errors.phone?.message?.toString()}</p>
                                </Grid> 
                                <Grid item xs={12} md={4}>
                                    <Typography className="typography">Telefone</Typography>
                                    <PhoneInput {...register("secondPhone", {required: 'O Telefone é obrigatório', validate: value => ValidationHelper.validarTelephone(value) || "Telefone inválido"})} className="phonebox" defaultCountry="br" onChange={() => {}} />
                                    <p className="errorMsg">{errors.secondPhone?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography className="typography">CEP</Typography>
                                    <input {...register("zipCode", {required: 'O CEP é obrigatório'})} className="inputMain" type="text" name="cep" id="txt-given-name" disabled={disableInput} onBlur={handleCepBlur}/>
                                    <p className="errorMsg">{errors.zipCode?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography className="typography">Estado</Typography>
                                    <Select {...register("state", {required: 'Selecione um estado'})} label="estado" fullWidth className="inputSelect" sx={{'& legend': { display: 'none' }, textAlign: "left"}} onChange={handleChangeCity}>
                                        {estados.map((estado) => (
                                             <MenuItem key={estado.id} value={estado.id}>{estado.nome}</MenuItem>
                                        ))}
                                    </Select>
                                    <p className="errorMsg">{errors.state?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography className="typography">Cidade</Typography>
                                    <Select {...register("city", {required: 'Selecione uma cidade'})} label="city" fullWidth className="inputSelect" sx={{'& legend': { display: 'none' }, textAlign: "left"}} disabled={disableCityInput}>
                                        {cidades.map((estado) => (
                                             <MenuItem key={estado.id} value={estado.id}>{estado.nome}</MenuItem>
                                        ))}
                                    </Select>
                                    <p className="errorMsg">{errors.city?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography {...register("address", {required: 'O Endereço é obrigatório'})} className="typography">Endereço</Typography>
                                    <input className="inputMain" type="text" name="endereco" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.address?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Typography className="typography">Número</Typography>
                                    <input {...register("number", {required: 'O Número é obrigatório'})} className="inputMain" type="text" name="numero" id="txt-given-name" disabled={disableInput}/>
                                    <p className="errorMsg">{errors.number?.message?.toString()}</p>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Typography className="typography">Complemento</Typography>
                                    <input {...register("complement", {required: 'O Complemento é obrigatório'})} className="inputMain" type="text" name="complemento" id="txt-given-name" disabled={disableInput}/>
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
                    <button className="formButton backButton" onClick={()=> navigate('/configuracoes')}>Voltar</button>
                    {!load ? (
                        <button className="formButton" type="submit" onClick={()=> handleSubmit}>Salvar</button>
                    ):(
                        <button className="formButton formButtonLoad" disabled>Aguarde...</button>
                    )}
                </div>
            </form>
        </div>

    )

}

export default ContaPrincipal;