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
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Alert, Button, Divider, Snackbar } from "@mui/material";
import { Transcription } from "../../interfaces/transcription.interfaces";
import { useAuth } from "../../context/AuthContext";
import "./resumos.css";

function Resumos() {
    const [resumes, setResumes] = useState<Transcription[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const userLogged = localStorage.getItem("userLogger");
    const { user } = useAuth();
    let navigate = useNavigate();

    interface Column {
        id: '_id' | 'link' | 'createdAt' | 'success' | 'actions';
        label: string;
        minWidth?: number;
        align?: 'right' | 'left' | 'center';
        format?: (value: number) => string;
    }

    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: readonly Column[] = [
        { id: '_id', label: 'ID', minWidth: 60 },
        { id: 'link', label: 'Link', minWidth: 150, align: 'center' },
        { id: 'createdAt', label: 'Data de Criação', minWidth: 80, align: 'center' },
        { id: 'actions', label: 'Ações', minWidth: 120, align: 'center' }
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

    const handleProcessAgain = async(userLogged: string | null,link: string) => {
        if(userLogged){
            let response = await ResumoRapidoService.reprocessUserAudio(user.token, link)
            if(response && response.data.success){
                setOpen(true);
            }
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        window.location.reload();
    };

    const goToResumePage = (resume: any) => {
        const responseP = resume;
        navigate('/resumo', {state:{response:responseP}});
    }

    useEffect(()=>{
        const getUserPaymentsData = async(): Promise<void> =>{
        try{
            if(userLogged){
                let response = await ResumoRapidoService.getUserResumes(user.token);
                if(response && response.data){
                setResumes(response.data.transcriptions);
                }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
        }
        getUserPaymentsData();
    },[])
  return (
    <DashboardLayout title="Resumos">
      <div className='resumosAnteriores'>
        <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 10 }}>
            <div className="promptTableHeader">
                <div className="promptDescription">
                <h3 className="titlePlan">Histórico de Resumos</h3>
                <p className="subtitlePlan">Veja seus últimos atendimentos aqui</p>
                <h5 className="subtitlePlan">Os atendimentos salvos tem uma duração de 24h</h5>
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
                {resumes && resumes.length > 0 &&
                <TableBody>
                {resumes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        {columns.map((column) => {
                        const value = row[column.id as keyof Transcription];
                
                        return (
                            <TableCell key={column.id} align={column.align}>
                            {column.id === 'link' && value ? (
                                <a href={value as string} target="_blank" rel="noopener noreferrer">
                                {truncateText(value as string, 30)}
                                </a>
                            ) : column.id === 'createdAt' ? (
                                new Date(value as string).toLocaleDateString()
                            ) : column.id === 'actions' ? (
                                row.data.success ? (
                                <>
                                    <span className="processedBtn">Processado</span>
                                    <Button 
                                    className="seeProcessedBtn"
                                    onClick={() => goToResumePage(row)}
                                    >
                                    Ver Resumo
                                    </Button>
                                </>
                                ) : (
                                <Button 
                                    className="reProcessedBtn"
                                    onClick={() => handleProcessAgain(userLogged,row.link)}
                                >
                                    Processar
                                </Button>
                                )
                            ) : (
                                value?.toString()
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
                count={resumes ? resumes.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <button className="backButton" onClick={()=> navigate('/atendimento')}>Voltar</button>
        </Paper>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                Resumo processado com sucesso!
            </Alert>
        </Snackbar>
      </div>
    </DashboardLayout>
  );
}

export default Resumos;
