import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from '@mui/material';
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import NavBar from "../../utils/navbar/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const planoData = location.state;
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const token = user.token;
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    billingZip: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    paymentMethod: 'creditCard',
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: false,
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [plano, setPlano] = useState({
    _id: '',
    name: '',
    gatewayId: '',
    value: '',
    active: ''
  });

  const handleShippingChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  const handlePaymentChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleBillingChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: { target: { checked: any; }; }) => {
    setBillingInfo({
      ...billingInfo,
      sameAsShipping: e.target.checked,
    });
  };

  const handleSubmit = async() => {
    // Lógica de envio do checkout
    console.log('Shipping Info:', shippingInfo);
    console.log('Payment Info:', paymentInfo);
    console.log('Billing Info:', billingInfo);

    try{
        let responseSubscription = await ResumoRapidoService.updateUserSubscription(planoData._id, token);
        if(responseSubscription && responseSubscription?.data?._id){
            navigate('/plano-contratado')
        }
    } catch(e){
        console.log('Erro encontrado:', e);
    }
  };

  useEffect(() => {
    if (planoData !== undefined) {
        console.log(planoData);
        setPlano(planoData);
    }
  }, [planoData]);

  return (
        
    <div style={{padding: "1px"}}>
        <NavBar />
        <Grid container spacing={3} style={{paddingTop:"120px", paddingLeft:"30px", paddingRight:"30px"}}>
            <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Seus dados para pagamento
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        autoComplete="given-name"
                        variant="outlined"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        autoComplete="family-name"
                        variant="outlined"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        autoComplete="email"
                        variant="outlined"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        id="address"
                        name="address"
                        label="Address"
                        fullWidth
                        autoComplete="shipping address-line1"
                        variant="outlined"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="Town/City"
                        fullWidth
                        autoComplete="shipping address-level2"
                        variant="outlined"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="state"
                        name="state"
                        label="County/State/Province/Territory"
                        fullWidth
                        variant="outlined"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="zip"
                        name="zip"
                        label="Zip/Postal Code"
                        fullWidth
                        autoComplete="shipping postal-code"
                        variant="outlined"
                        value={shippingInfo.zip}
                        onChange={handleShippingChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="country-label">Select Country</InputLabel>
                        <Select
                        labelId="country-label"
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        label="Select Country"
                        onChange={handleShippingChange}
                        >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="CA">Canada</MenuItem>
                        <MenuItem value="MX">Mexico</MenuItem>
                        {/* Adicione mais países conforme necessário */}
                        </Select>
                    </FormControl>
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Meio de Pagamento
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup row name="paymentMethod" value={paymentInfo.paymentMethod} onChange={handlePaymentChange}>
                        <FormControlLabel value="testGateway" control={<Radio />} label="Test Gateway" />
                        <FormControlLabel value="creditCard" control={<Radio />} label="Cartão de Crédito" />
                        </RadioGroup>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        id="cardNumber"
                        name="cardNumber"
                        label="Credit Card Number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="outlined"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        id="billingZip"
                        name="billingZip"
                        label="Billing Zip"
                        fullWidth
                        autoComplete="billing postal-code"
                        variant="outlined"
                        value={paymentInfo.billingZip}
                        onChange={handlePaymentChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="expMonth-label">Month</InputLabel>
                        <Select
                        labelId="expMonth-label"
                        id="expMonth"
                        name="expMonth"
                        value={paymentInfo.expMonth}
                        label="Month"
                        onChange={handlePaymentChange}
                        >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {[...Array(12)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="expYear-label">Year</InputLabel>
                        <Select
                        labelId="expYear-label"
                        id="expYear"
                        name="expYear"
                        value={paymentInfo.expYear}
                        label="Year"
                        onChange={handlePaymentChange}
                        >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {[...Array(10)].map((_, i) => (
                            <MenuItem key={i + new Date().getFullYear()} value={i + new Date().getFullYear()}>{i + new Date().getFullYear()}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        id="cvv"
                        name="cvv"
                        label="CVC"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="outlined"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                    />
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Endereço de cobrança
                </Typography>
                <FormControlLabel
                    control={<Checkbox checked={billingInfo.sameAsShipping} onChange={handleCheckboxChange} name="sameAsShipping" />}
                    label="O endereço de cobrança é o mesmo do cadastro"
                />
                {!billingInfo.sameAsShipping && (
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                        required
                        id="name"
                        name="name"
                        label="Billing Name"
                        fullWidth
                        variant="outlined"
                        value={billingInfo.name}
                        onChange={handleBillingChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        id="address"
                        name="address"
                        label="Address"
                        fullWidth
                        autoComplete="billing address-line1"
                        variant="outlined"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        autoComplete="billing address-level2"
                        variant="outlined"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        id="state"
                        name="state"
                        label="State"
                        fullWidth
                        variant="outlined"
                        value={billingInfo.state}
                        onChange={handleBillingChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        id="zip"
                        name="zip"
                        label="Zip/Postal Code"
                        fullWidth
                        autoComplete="billing postal-code"
                        variant="outlined"
                        value={billingInfo.zip}
                        onChange={handleBillingChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                        <InputLabel id="billing-country-label">Select Country</InputLabel>
                        <Select
                            labelId="billing-country-label"
                            id="billingCountry"
                            name="country"
                            value={billingInfo.country}
                            label="Select Country"
                            onChange={handleBillingChange}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="US">United States</MenuItem>
                            <MenuItem value="CA">Canada</MenuItem>
                            <MenuItem value="MX">Mexico</MenuItem>
                            {/* Adicione mais países conforme necessário */}
                        </Select>
                        </FormControl>
                    </Grid>
                    </Grid>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <button className="formButton" type="submit" onClick={()=> handleSubmit()}>Fechar Pedido</button>
                </Box>
                </form>
            </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }} style={{textAlign: 'left'}}>
                <Typography variant="h6" gutterBottom>
                Seu pedido
                </Typography>
                <Typography>{plano?.name} - R${plano?.value}</Typography>
                <Box sx={{ my: 2 }}>
                <Button variant="text" color="success" onClick={()=> navigate('/planos')}>Voltar aos planos</Button>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Descontos
                </Typography>
                <TextField
                fullWidth
                id="discountCode"
                name="discountCode"
                label="Insira o Cupom"
                variant="outlined"
                sx={{ mb: 2 }}
                />
                <button className="formButton" type="submit" onClick={()=> navigate('/plano-contratado')}>Aplicar Desconto</button>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Total a pagar
                </Typography>
                <Typography variant="h5">R$49.90</Typography>
            </Paper>
            </Grid>
        </Grid>
    </div>
  );
};

export default Checkout;
