import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/joy/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch'
    },
  },
}));

function SearchModal({ setIndex, questions }) {

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [filterData, setFilterData] = useState([]);
  
  const navigate = useNavigate();

  const searchQuestion = (e) => {
    const filtered = questions.filter(data => {
      return data.answer.toUpperCase().includes(e.target.value.toUpperCase())
    });
    setFilterData(filtered);
  }

  const handleListItemClick = (e, index) => {
    setSelectedIndex(index);
    setIndex(index);
    navigate("/");
    setFilterData([]);
    setOpen(false)
  }

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          onClick={() => {setOpen(true)}}
          readOnly
        />
      </Search>

      <Modal open={open} onClose={() => {setOpen(false)}}>
        <Box className="modal">
          <TextField placeholder="Search anything…" onChange={(e) => {searchQuestion(e)}} />

          <List component="nav" 
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 300
          }}>

            {
              filterData.map(data => 
                <ListItemButton
                  selected={selectedIndex === data._id}
                  onClick={(e) => handleListItemClick(e, data._id)}
                  key={data._id}
                >
                  <ListItemText primary={data.answer} />
                </ListItemButton>
              )
            }

          </List>
        </Box>
      </Modal>
    </>
  )
}

export default SearchModal;