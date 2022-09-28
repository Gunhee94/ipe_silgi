import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import ManagerModal from '../managerModal/ManagerModal';

function Manage() {

    const [questions, setQuestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState({});

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

    return (
        <div className='container'>
            <div className='filter'>
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