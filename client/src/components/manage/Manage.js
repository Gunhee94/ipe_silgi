import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';
import ManagerModal from '../managerModal/ManagerModal';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';

function Manage() {

    const [questions, setQuestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState({});
    const [alignment, setAlignment] = useState("basic");
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * 10;

    useEffect(() => {
        getQuestions();
     }, [])
 
    const getQuestions = () => {
        fetch("/list")
        .then(res => res.json())
        .then(data => {
            setQuestions(data.questions);
            data.questions.length >= 10 ? setTotalPage(Math.ceil(data.questions.length / 10)) : setTotalPage(1);
            handleChange("basic");
            
        });
    }

    const getQuestion = (id) => {
        setOpen(true)
        
        if (id !== undefined) {

            const question = questions.find(data => data._id === id);
            setQuestion(question)

        } else {
            setQuestion({})
        }

    }

    const handleChange = (e) => {
        
        if (e == "basic") {
            questions.sort((a, b) => a._id - b._id);
        } else if (e == "abc") {
            questions.sort((a, b) => a.answer.localeCompare(b.answer));
        } else if (e == "new") {
            questions.sort((a, b) => b._id - a._id);
        }

        setAlignment(e);
    };

    return (
        <Container>

            <div className='filter'>
                <ToggleButtonGroup
                    color="primary"
                    size='small'
                    value={alignment}
                    exclusive
                    onChange={(e) => {handleChange(e.target.value)}}
                >
                    <ToggleButton value="basic">기본순</ToggleButton>
                    <ToggleButton value="abc">가나다순</ToggleButton>
                    <ToggleButton value="new">새로운문제순</ToggleButton>
                </ToggleButtonGroup>

                <Button variant="contained" onClick={() => {getQuestion()}}>문제등록</Button>
            </div>

            {
                questions.length == 0 ? 
                    <div className="box" >
                        문제를 등록해주세요
                    </div>
                :
                questions.slice(offset, offset + 10).map((data) => 
                    <div className="box" key={data._id} onClick={() => {getQuestion(data._id)}}>
                        {data.answer}
                    </div>
                )
            }

            {
                questions.length > 0 &&
                <div className="page">
                    <Pagination count={totalPage} color="primary" page={page} onChange={(e, v)=> {setPage(v)}} />
                </div>
            }
           <ManagerModal open={open} 
                         setOpen={setOpen} 
                         question={question}
                         setQuestion={setQuestion}
                         getQuestions={getQuestions}
            />
            
        </Container>
    )
}

export default Manage;