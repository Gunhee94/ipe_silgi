import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';
import ManagerModal from '../managerModal/ManagerModal';

function Manage() {

    const [questions, setQuestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState({});
    const [alignment, setAlignment] = useState("basic");

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
   
        if (e.target.value == "basic") {
            questions.sort((a, b) => a._id - b._id);
        } else if (e.target.value == "abc") {
            questions.sort((a, b) => a.answer.localeCompare(b.answer));
        } else if (e.target.value == "new") {
            questions.sort((a, b) => b._id - a._id);
        }

        setAlignment(e.target.value);
        setQuestion(questions)
    };

    return (
        <div className='container'>

            <div className='filter'>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={(e) => {handleChange(e)}}
                >
                    <ToggleButton value="basic">기본순</ToggleButton>
                    <ToggleButton value="abc">가나다순</ToggleButton>
                    <ToggleButton value="new">새로운문제순</ToggleButton>
                </ToggleButtonGroup>

                <Button variant="contained" onClick={() => {getQuestion()}}>문제등록</Button>
            </div>

            {
                questions.map((data) => 
                    <div className="box" key={data._id} onClick={() => {getQuestion(data._id)}}>
                        {data.answer}
                    </div>
                )
            }

           <ManagerModal open={open} 
                         setOpen={setOpen} 
                         question={question}
                         setQuestion={setQuestion}
                         getQuestions={getQuestions}
            />
            
        </div>
    )
}

export default Manage;