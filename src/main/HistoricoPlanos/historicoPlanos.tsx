import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import "./historicoPlanos.css";
import { Button, Divider } from "@mui/material";
import { Payment, PaymentsData } from "../../interfaces/payment.interfaces";
import generalHelper from "../../helpers/generalHelper";

  const HistoricoPlanos = () => {
    const [payments, setPayments] = useState<PaymentsData[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { user } = useAuth();
    let navigate = useNavigate();


    interface Column {
      id: 'id' | 'dueDate' | 'dateCreated' | 'value' | 'status' | 'description' | 'transactionReceiptUrl';
      label: string;
      minWidth?: number;
      align?: 'right' | 'left' | 'center';
      format?: (value: number) => string;
    }
    
    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: readonly Column[] = [
      { id: 'id', label: 'ID', minWidth: 60 },
      { id: 'dueDate',label: 'Vencimento',minWidth: 60,align: 'right' },
      { id: 'dateCreated',label: 'Pagamento',minWidth: 60,align: 'right'},
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
              let response = await ResumoRapidoService.getUserPayments(user.token);
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
  
  
    return (
      loading?<Loader/>:
      <div>
        <NavBar/>
        <div className="atendimentoContainer">
            <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 10 }}>
                <div className="promptTableHeader">
                  <div className="promptDescription">
                    <h3 className="titlePlan">Consumo</h3>
                    <p className="subtitlePlan">Seu plano atual é o: <b>{user.userPlan.planName}</b><br/> Você tem direito há: {generalHelper.getDiference(user.userPlan.limit, user.userPlan.consumption)} resumo(s)</p>
                  </div>
                </div>
            </Paper>
            <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 10 }}>
                <div className="promptTableHeader">
                  <div className="promptDescription">
                    <h3 className="titlePlan">Cobranças</h3>
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
                          .map((row) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.payment.id}>
                              {columns.map((column) => {
                                const value = row.payment[column.id as keyof Payment];

                                // Verifica se é o campo 'invoiceUrl' e se o valor está presente
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.id === 'transactionReceiptUrl' && row.payment.transactionReceiptUrl ? (
                                      <Button
                                        className="btnReceipt"
                                        onClick={() => window.open(row.payment.transactionReceiptUrl, '_blank')}
                                      >
                                        Ver Comprovante
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
                <button className="formButton backButton" onClick={()=> navigate('/configuracao-parametro')}>Voltar</button>
            </Paper>
            
        </div>
      </div>
    );
  };
  
  export default HistoricoPlanos;