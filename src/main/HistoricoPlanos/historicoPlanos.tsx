import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
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
import "./historicoPlanos.css";
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import { Chip, Divider } from "@mui/material";

  const HistoricoPlanos = () => {
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    let navigate = useNavigate();
    let authkey:string | null = "unlogged";

    interface Column {
        id: 'id' | 'mes' | 'ano' | 'vencimento' | 'pagamento' | 'valor' | 'status' | 'plano';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
      }
      
      //Para formatar um registro use: format: (value: number) => value.toFixed(2)
      const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 80 },
        { id: 'mes', label: 'Mes', minWidth: 80 },
        { id: 'ano', label: 'Ano', minWidth: 80 },
        { id: 'vencimento',label: 'Vencimento',minWidth: 80,align: 'right' },
        { id: 'pagamento',label: 'Pagamento',minWidth: 80,align: 'right'},
        { id: 'valor',label: 'Valor',minWidth: 80,align: 'right'},
        { id: 'status',label: 'Status',minWidth: 80,align: 'right'},
        { id: 'plano',label: 'Plano',minWidth: 80,align: 'right'},
      ];
      
      interface Data {
        id: string;
        mes: string;
        ano: string;
        vencimento: string;
        pagamento: string;
        valor: string;
        status: string;
        plano: string;
      }
      
      function createData(
        id: string,
        mes: string,
        ano: string,
        vencimento: string,
        pagamento: string,
        valor: string,
        status: string,
        plano: string,
      ): Data {
        return { id, mes, ano, vencimento, pagamento, valor, status, plano };
      }
      
      const rows = [
        createData('1','Agosto', '2023', '10/08/2023', '08/08/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('2','Setembro', '2023', '10/09/2023', '03/09/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('3','Outubro', '2023', '10/10/2023', '05/10/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('4','Novembro', '2023', '10/11/2023', '02/11/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('5','Dezembro', '2023', '10/12/2023', '03/12/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('6','Janeiro', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('7','Fevereiro', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('8','Março', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('9','Abril', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('10','Maio', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('11','Junho', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('12','Julho', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('13','Agosto', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('14','Setembro', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('15','Outubro', '2024', '05/01/2024', '03/01/2024', 'R$45,00', 'Pago', 'PRO'),
        createData('16','Novembro', '2024', '10/11/2023', '02/11/2023', 'R$45,00', 'Pago', 'PRO'),
        createData('17','Dezembro', '2024', '10/12/2023', '03/12/2023', 'R$45,00', 'Pago', 'PRO'),
      ];
      
      
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    useEffect(()=>{
        authkey = localStorage.getItem("authkey");
        setLogged(authkey == 'logged');
        setLoading(false);
    },[])
  
  
    return (
      loading?<Loader/>:
      logged?
      <div>
        <NavBar/>
        <div className="atendimentoContainer">
            
            <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 10 }}>
                <h3 className="titlePlan">Cobrança</h3>
                <p className="subtitlePlan">Veja seu histórico de pagamentos</p>
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
                    <TableBody>
                        {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <button className="formButton backButton" onClick={()=> navigate('/configuracoes')}>Voltar</button>
        </div>
      </div>
       :
      <div>
        Acesso não autorizado
      </div>
    );
  };
  
  export default HistoricoPlanos;