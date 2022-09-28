import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/material/Button';

function ManagerModal({ open, setOpen, question, setQuestion, getQuestions }) {

    const onChange = (e) => {

        const newQuestion = {...question};

        if (e.target.name === "title") {
            newQuestion.title = e.target.value;
        } else if (e.target.name === "content") {
            newQuestion.content = e.target.value;
        } else if (e.target.name === "answer") {
            newQuestion.answer = e.target.value;
        }

        setQuestion(newQuestion);
    }

    const addQuestion = () => {

        fetch(`/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question : question
            }),
        })
        .then(res => {
            if (res.ok) {
                setOpen(false);
                getQuestions();
            }
        })
    }

    const updateQuestion = () => {

        fetch("/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question : question
            }),
        })
        .then(res => {
            if (res.ok) {
                setOpen(false);
                getQuestions();
            }
        })

    }

    const delQuestion = () => {
        
        fetch(`/delete/${question._id}`, {
            method: "DELETE"
            })
            .then(res => {
                if (res.ok) {
                    setOpen(false);
                    getQuestions();
                }
            })
    }

    return (
        <Modal open={open} onClose={() => {setOpen(false)}}>
            <Box className="modal">
                <FormControl>
                    <FormLabel>문제</FormLabel>
                    <Textarea type="text" name="title" value={question.title} onChange={(e) => {onChange(e)}}/>
                </FormControl>
                <FormControl>
                    <FormLabel>본문</FormLabel>
                    <Textarea type="text" name="content" value={question.content} onChange={(e) => {onChange(e)}}/>
                </FormControl>
                <FormControl>
                    <FormLabel>답</FormLabel>
                    <Textarea type="text" name="answer" value={question.answer} onChange={(e) => {onChange(e)}}/>
                </FormControl>

                <hr style={{marginTop: "20px"}}/>

                {
                    question._id === undefined ?
                        <Button variant="contained" className="btn" onClick={addQuestion}>확인</Button>
                    :
                    <>
                        <Button variant="contained" className="btn" onClick={updateQuestion} >수정</Button>
                        <Button variant="contained" className="btn" style={{marginRight:"5px"}} onClick={delQuestion} color="error">삭제</Button>
                    </>
                }
            </Box>
        </Modal>
    )
}

export default ManagerModal;