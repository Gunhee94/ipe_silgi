import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Detail from './components/detail/Detail';
import Manage from './components/manage/Manage';
import SearchModal from './components/searchModal/SearchModal';

function App() {

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestions();

  }, [])

  const getQuestions = () => {
    fetch("/list")
    .then(res => res.json())
    .then(data => {
        setQuestions(data.questions);
    });
  }

  return (

    <div className="App">

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ mr: 3, cursor: "pointer" }} onClick={()=> {navigate('/')}}>
              문제
            </Typography>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={()=> {navigate('/manage')}}>
              문제관리
            </Typography>
          
            <SearchModal setIndex={setIndex} questions={questions}/>
        

          </Toolbar>
        </AppBar>
      </Box>

      <Routes>
        <Route path='/' element={ <Detail index={index} setIndex={setIndex} questions={questions} /> }/>
        <Route path='/manage' element={ <Manage questions={questions} getQuestions={getQuestions}/> }/>
        <Route path='*' element={ <div></div> }/>
      </Routes>

    </div>

  );
}

export default App;
