import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

  return (

    <div className="App">

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ mr: 3 }} onClick={()=> {navigate('/')}}>
              정처기실기
            </Typography>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1 }} onClick={()=> {navigate('/manage')}}>
              문제관리
            </Typography>

            <SearchModal setIndex={setIndex}/>

          </Toolbar>
        </AppBar>
      </Box>

      <Routes>
        <Route path='/' element={ <Detail index={index} setIndex={setIndex} /> }/>
        <Route path='/manage' element={ <Manage /> }/>
        <Route path='*' element={ <div></div> }/>
      </Routes>

    </div>

  );
}

export default App;
