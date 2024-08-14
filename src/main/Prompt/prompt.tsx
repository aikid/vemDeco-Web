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
import "./prompt.css";
import { Chip, Divider } from "@mui/material";

  const Prompt = () => {
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    let navigate = useNavigate();
    let authkey:string | null = "unlogged";

    interface Column {
        id: 'id' | 'tipo' | 'acoes';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
      }
      
      //Para formatar um registro use: format: (value: number) => value.toFixed(2)
      const columns: readonly Column[] = [
        { id: 'id', label: 'ID', minWidth: 80 },
        { id: 'tipo', label: 'Tipo', minWidth: 80 },
        { id: 'acoes', label: 'Acoes', minWidth: 80 },
      ];
      
      interface Data {
        id: string;
        tipo: string;
        acoes: string;
      }
      
      function createData(
        id: string,
        tipo: string,
        acoes: string,
      ): Data {
        return { id, tipo, acoes };
      }
      
      const rows = [
        createData('1','Prompt para consulta de pediatria', 'Editar | Deletar'),
        createData('2','Prompt para consulta de clinico geral', 'Editar | Deletar'),
        createData('3','Prompt para consulta de oncologia', 'Editar | Deletar'),
        createData('4','Prompt para consulta de ortopedia', 'Editar | Deletar'),
        createData('5','Prompt para consulta de cardiologia', 'Editar | Deletar'),
        createData('6','Prompt para consulta de neurologia', 'Editar | Deletar'),
        createData('7','Prompt para consulta de endocrinologia', 'Editar | Deletar'),
        createData('8','Prompt para consulta de dermatologia', 'Editar | Deletar'),
        createData('9','Prompt para consulta de psiquiatria', 'Editar | Deletar'),
        createData('10','Prompt para consulta de ginecologia', 'Editar | Deletar'),
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
                <h3 className="titlePlan">Configuração de Prompt</h3>
                <p className="subtitlePlan">Gerenciamento os Prompt's que podem ser usados nas consultas</p>
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
                <button className="formButton backButton" onClick={()=> navigate('/configuracao-parametro')}>Voltar</button>
            </Paper>
            
        </div>
      </div>
       :
      <div>
        Acesso não autorizado
      </div>
    );
  };
  
  export default Prompt;