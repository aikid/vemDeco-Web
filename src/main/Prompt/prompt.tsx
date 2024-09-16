import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
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
import "./prompt.css";
import CreateIcon from '@mui/icons-material/Create';
import StarIcon from '@mui/icons-material/Star';
import { Alert, Box, Button, Chip, Divider, Modal, Snackbar, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { IPromptRequest, PromptData } from "../../model/user/user-prompt-request";

  const Prompt = () => {
    const [message, setMessage] = useState<string>("");
    const [selectedPrompt, setSelectedPrompt] = useState<string>("");
    const [selectedPromptID, setSelectedPromptID] = useState<string>("");
    const [prompts, setPrompts] = useState<PromptData[]>();
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = React.useState(false);
    const [openSnack, setOpenSnack] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const token = localStorage.getItem("userToken");
    let navigate = useNavigate();
    let authkey:string | null = "unlogged";

    const { register, handleSubmit, formState:{errors}, reset, setValue } = useForm({
      defaultValues: {
          prompt:"",
      },      
  });

    interface Column {
      id: '_id' | 'prompt' | 'email' | 'default' | 'actions';
      label: string;
      minWidth?: number;
      align?: 'left' | 'right' | 'center';
      format?: (value: number) => string;
    }
      
    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: Column[] = [
      { id: '_id', label: 'ID', minWidth: 50 },
      { id: 'prompt', label: 'Prompt', minWidth: 200 },
      { id: 'email', label: 'Usuario Criador', minWidth: 150 },
      { id: 'default', label: 'Prompt Padrão?', minWidth: 50, align: 'center' },
      { id: 'actions', label: 'Ações', minWidth: 150, align: 'center' }
    ];
      
      
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const savePrompt = async (data: IPromptRequest) => {
      try{
        setLoad(true);
        if(selectedPromptID){
          await ResumoRapidoService.updatePrompt(token, selectedPromptID, data);
          setLoad(false);
          setSelectedPromptID("");
          setSelectedPrompt("");
          setMessage('Prompt atualizado com sucesso');
          setOpen(false);
          setOpenSnack(true);
        }else{
          await ResumoRapidoService.savePromptData(token, data);
          setMessage('Prompt criado com sucesso');
          setOpen(false);
          setOpenSnack(true);
          setLoad(false);
        }
    }catch (e){
        setLoad(false);
        console.log('Erro encontrado:', e);
    }
    }

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnack(false);
      reset();
      window.location.reload()
    };

    const handleEdit = (id: string, prompt: string) => {
      setSelectedPromptID(id);
      setSelectedPrompt(prompt);
      handleOpen();
    };
    
    const handleSetDefault = async(id: string) => {
      try{
        await ResumoRapidoService.setDefaultPrompts(token, id);
        setMessage('Prompt atualizado para padrão');
        setOpenSnack(true);
      }catch(e){
        console.log('Erro encontrado:', e);
      }
    };

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    useEffect(() => {
      setValue("prompt", selectedPrompt);
    }, [selectedPrompt,selectedPromptID, setValue]);    

    
    useEffect(()=>{
        authkey = localStorage.getItem("authkey");
        setLogged(authkey == 'logged');
        setLoading(false);
    },[])

    useEffect(()=>{
      const getUserPromptsData = async(): Promise<void> =>{
        try{
            if(token){
                let response = await ResumoRapidoService.getUserPrompts(token);
                if(response && response.data){
                  setPrompts(response.data);
                }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
      }
      getUserPromptsData();
    },[])
  
  
    return (
      loading?<Loader/>:
      logged?
      <div>
        <NavBar/>
        <div className="atendimentoContainer">
            
            <Paper sx={{ width: '85%', overflow: 'hidden', marginTop: 10 }}>
                <div className="promptTableHeader">
                  <div className="promptDescription">
                    <h3 className="titlePlan">Configuração de Prompt</h3>
                    <p className="subtitlePlan">Gerenciamento os Prompt's que podem ser usados nas consultas</p>
                  </div>
                  <div className="promptActions">
                    <Button className="bt-add-prompt" variant="contained" onClick={handleOpen}>+</Button>
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
                    {prompts && prompts.length > 0 &&
                      <TableBody>
                        {prompts
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row: PromptData) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                {columns.map((column) => {
                                  if (column.id === 'actions') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        <div className="buttonTableContainer">
                                          <Button
                                            className="editButton"
                                            onClick={() => handleEdit(row._id, row.prompt)}
                                          >
                                            <CreateIcon />
                                          </Button>
                        
                                          <Button
                                            className="defaltuButton"
                                            onClick={() => handleSetDefault(row._id)}
                                            style={{ marginLeft: '10px' }}
                                          >
                                            <StarIcon />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    );
                                  }
                                  const value = row[column.id];
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {
                                        column.id === 'default' ? (value ? 'Sim' : 'Não') :
                                        column.id === 'prompt' && typeof value === 'string' ? truncateText(value, 60) : value
                                      }
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    }
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={prompts ? prompts.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <button className="formButton backButton" onClick={()=> navigate('/configuracao-parametro')}>Voltar</button>
            </Paper>
            
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="modalContent">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Adicionar Novo Prompt
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <form className="mobileLoginForm" onSubmit={handleSubmit((data)=>{savePrompt(data)})}>
                <textarea className="promptInModal"  placeholder="Edite seu prompt aqui..." {...register("prompt", {required: 'O Prompt é obrigatório', minLength: {value: 80, message: "O prompt deve ter no mínimo 80 caracteres."}})}></textarea>
                <p className="errorMsg">{errors.prompt?.message?.toString()}</p>
                {!load ? (
                    <button className="modalFormButton" type="submit" onClick={()=> handleSubmit}>Salvar Prompt</button>
                ):(
                    <button className="modalFormButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                )}
              </form>
            </Typography>
          </Box>
        </Modal>
        <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <Alert onClose={handleCloseSnack} severity="success" variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
      </div>
       :
      <div>
        Acesso não autorizado
      </div>
    );
  };
  
  export default Prompt;