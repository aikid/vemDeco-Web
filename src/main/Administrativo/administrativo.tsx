import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import "./administrativo.css";
import { Divider, Grid } from "@mui/material";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { UserData } from "../../interfaces/userEdit.interfaces";
import { PieChart } from '@mui/x-charts/PieChart';
import moment from "moment";
import { BarChart } from "@mui/x-charts";

const Administrativo = () => {
    const [users, setUsers] = useState<UserData[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [typeData, setTypeData] = useState<{ id: number; value: number; label: string }[]>([]);
    const [xAxisData, setXAxisData] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const { user } = useAuth();
    let navigate = useNavigate();


    interface Column {
      id: '_id' | 'name' | 'email' | 'type' | 'createdAt' | 'gatewayCustomerId';
      label: string;
      minWidth?: number;
      align?: 'right' | 'left' | 'center';
      format?: (value: number) => string;
    }

    const tiposPessoa = {
      "pf": "Pessoa Física",
      "pj": "Pessoa Jurídica",
    };
    
    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: readonly Column[] = [
      { id: '_id', label: 'ID', minWidth: 60 },
      { id: 'name',label: 'Nome',minWidth: 60,align: 'right'},
      { id: 'email',label: 'E-mail',minWidth: 60,align: 'right' },
      { id: 'type',label: 'Tipo de Pessoa',minWidth: 60,align: 'center'},
      { id: 'gatewayCustomerId',label: 'Id de pagamentos',minWidth: 120,align: 'center'},
      { id: 'createdAt',label: 'Data de Criação',minWidth: 60,align: 'center'},
      
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
      const getUserListData = async(): Promise<void> =>{
        try{
            if(user.token){
              let response = await ResumoRapidoService.getUserList(user.token);
              if(response && response.data){
                setUsers(response.data);
              }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
      }
      getUserListData();
    },[])

    useEffect(() => {
      if(!users || users.length < 0) return
      const typeCount = users.reduce((acc, curr) => {
        if (curr.type) {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
  
      const occupationCount = users.reduce((acc, curr) => {
        if (curr.occupation) {
          acc[curr.occupation] = (acc[curr.occupation] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
  
      const formattedTypeData = Object.entries(typeCount).map(([key, value], index) => ({
        id: index,
        value,
        label: key === 'pf' ? 'Física' : 'Jurídica',
      }));
  
      const predefinedCategories = [
        'Médico',
        'Enfermeiro',
        'Advogado',
        'R.H',
        'Psicólogo',
        'Jornalista',
        'A. Social',
      ];
  
      const xAxis = predefinedCategories;
      const series = predefinedCategories.map((category) => occupationCount[category] || 0);
      
      setTypeData(formattedTypeData);
      setXAxisData(xAxis);
      setSeriesData(series);
    }, [users]);


    useEffect(()=>{
        const getUserInfo = async(): Promise<void> =>{
            try{
                if(user){
                    let response = await ResumoRapidoService.getUserInfo(user.token);
                    
                }
            }catch (e){
                console.log('Erro encontrado:', e);
            }
        }
        getUserInfo();
    },[])

    return (
        <DashboardLayout title="Usuários na Plataforma">
          <div className="confMenu">
              <a className="active" href="/administrativo">Usuarios</a>
              <a href="/consumo-geral">Consumo da plataforma</a>
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
                          <h3 className="titleChart">Tipos de pessoa</h3>
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
                          <h3 className="titleChart">Profissões</h3>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
              </Paper>
              <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 5 }}>
                  <div className="promptTableHeader">
                    <div className="promptDescription">
                      <h3 className="titlePlan">Usuarios Cadastrados</h3>
                      <p className="subtitlePlan">Veja os últimos usuários cadastrados na plataforma</p>
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
                      {users && users.length > 0 &&
                        <TableBody>
                          {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: UserData) => (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  if (column.id === 'createdAt') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                          {moment(value).format('DD/MM/YYYY')}
                                      </TableCell>
                                    );
                                  }
                                  if (column.id === 'type' && value) {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                          {(value in tiposPessoa) ? tiposPessoa[value as keyof typeof tiposPessoa] : "Tipo desconhecido"}
                                      </TableCell>
                                    );
                                  }
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                        {value}
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
                      count={users ? users.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
              </Paper>
              
          </div>
        </DashboardLayout>
    );
}

export default Administrativo;