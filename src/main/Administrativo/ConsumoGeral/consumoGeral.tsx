import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ResumoRapidoService from "../../../Service/resumo-rapido-service";
import "./consumoGeral.css";
import { Button, Divider, Grid } from "@mui/material";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { Payment, PaymentsData } from "../../../interfaces/payment.interfaces";
import { PieChart } from '@mui/x-charts/PieChart';
import moment from "moment";
import { BarChart } from "@mui/x-charts";
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

  const ConsumoGeral = () => {
    const [payments, setPayments] = useState<PaymentsData[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [typeData, setTypeData] = useState<{ id: number; value: number; label: string }[]>([]);
    const [xAxisData, setXAxisData] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const { user } = useAuth();
    let navigate = useNavigate();


    interface Column {
      id: 'id' | 'dueDate' | 'dateCreated' | 'value' | 'status' | 'description' | 'transactionReceiptUrl';
      label: string;
      minWidth?: number;
      align?: 'right' | 'left' | 'center';
      format?: (value: number) => string;
    }

    const tiposStatus = {
      "PENDING": "Pendente",
      "RECEIVED": "Recebido",
      "CONFIRMED": "Confirmado"
    };
    
    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: readonly Column[] = [
      { id: 'id', label: 'Identificação', minWidth: 60 },
      { id: 'dateCreated',label: 'Data de Pagamento',minWidth: 60,align: 'center'},
      { id: 'dueDate',label: 'Vencimento',minWidth: 60,align: 'right' },
      { id: 'value',label: 'Valor',minWidth: 60,align: 'right'},
      { id: 'status',label: 'Status',minWidth: 60,align: 'center'},
      { id: 'description',label: 'Plano',minWidth: 120,align: 'center'},
      { id: 'transactionReceiptUrl',label: 'Recibo',minWidth: 120,align: 'center'},
    ];
      
      
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };  
    
    


    useEffect(()=>{
      const getUserPaymentsData = async(): Promise<void> =>{
        try{
            if(user.token){
              let response = await ResumoRapidoService.getAllPayments(user.token);
              if(response && response.data){
                setPayments(response.data);
              }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
      }
      getUserPaymentsData();
    },[])

    useEffect(() => {
      if(!payments || payments.length < 0) return
      const typeCount = payments.reduce((acc, curr) => {
        if (curr.payment.status) {
          acc[curr.payment.status] = (acc[curr.payment.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
  
      const statusSum = payments.reduce((acc, curr) => {
        const status = curr.payment.status;
        const value = curr.payment.value;
        if (status) {
          acc[status] = (acc[status] || 0) + value;
        }
        return acc;
      }, {} as Record<string, number>);
  
  
      const formattedTypeData = Object.entries(typeCount).map(([key, value], index) => ({
        id: index,
        value,
        label: key,
      }));
  
      const predefinedStatuses = ["PENDING", "RECEIVED", "CONFIRMED"];
      const xAxis = predefinedStatuses;
      const series = predefinedStatuses.map((status) => statusSum[status] || 0);
      
      setTypeData(formattedTypeData);
      setXAxisData(xAxis);
      setSeriesData(series);
    }, [payments]);
  
  
    return (
        <DashboardLayout title="Consumo Geral">
          <div className="confMenu">
              <a href="/administrativo">Usuarios</a>
              <a className="active" href="/consumo-geral">Consumo da plataforma</a>
          </div>
          <div className="usuariosDashContainer">
              <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 5 }}>
                  <div className="promptTableHeader">
                    <div className="promptDescription">
                      <h3 className="titlePlan">Dashboard de Usuários</h3>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <PieChart
                            series={[
                              {
                                data: typeData,
                              },
                            ]}
                            width={500}
                            height={250}
                          />
                          <h3 className="titleChart">Status de pagamentos dos planos</h3>
                        </Grid>
                        <Grid item xs={6}>
                          <BarChart
                            xAxis={[
                              {
                                id: 'barCategories',
                                data: xAxisData,
                                scaleType: 'band',
                              },
                            ]}
                            series={[
                              {
                                data: seriesData,
                              },
                            ]}
                            width={600}
                            height={250}
                          />
                          <h3 className="titleChart">Valor obtido por status (em reais R$)</h3>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
              </Paper>
              <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 5 }}>
                  <div className="promptTableHeader">
                    <div className="promptDescription">
                      <h3 className="titlePlan">Últimas Cobranças</h3>
                      <p className="subtitlePlan">Veja seu histórico de pagamentos</p>
                    </div>
                  </div>
                  <Divider/>
                  <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                          <TableRow>
                          {columns.map((column) => (
                              <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              >
                              {column.label}
                              </TableCell>
                          ))}
                          </TableRow>
                      </TableHead>
                      {payments && payments.length > 0 &&
                        <TableBody>
                          {payments
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                              <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                {columns.map((column) => {
                                  const value = row.payment[column.id as keyof Payment];

                                  // Verifica se é o campo 'invoiceUrl' e se o valor está presente
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {column.id === 'transactionReceiptUrl' && row.payment.transactionReceiptUrl ? (
                                        <Button
                                          className="btnReceipt"
                                          onClick={() => window.open(row.payment.transactionReceiptUrl, '_blank')}
                                          startIcon={<SaveAltOutlinedIcon />}
                                        >
                                          Baixar
                                        </Button>
                                      ) : (
                                        value
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                        </TableBody>
                      }
                      </Table>
                  </TableContainer>
                  <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={payments ? payments.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
              </Paper>
              
          </div>
        </DashboardLayout>
    );
  };
  
  export default ConsumoGeral;