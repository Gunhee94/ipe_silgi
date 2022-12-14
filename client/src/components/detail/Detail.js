import styles from './Detail.module.css'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import Textarea from '@mui/joy/Textarea';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Detail ({ index, setIndex, questions }) {

    const [question, setQuestion] = useState({});    
    const [isAnswer, setIsAnswer] = useState(false);
    const [bookMarkList, setBookMarkList] = useState([]);
    const [isbookMark, setIsBookMark] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
        
        setIsAnswer(false);
        getQuestion();
    }, [index])

    const getQuestion = () => {
        if (!isLoading) {
            setIsLoading(true);
            fetch(`/list/${index}`)
            .then(res => res.json())
            .then(data => {
                if (data.question != null) {
                    setQuestion(data.question);
                    getBookMark(data.question);
                    setIndex(data.question._id)
                }
                setIsLoading(false);
            });
        }

    }

    const getBookMark = (question) => {
        let bookMark = localStorage.getItem("bookMark");
        bookMark = JSON.parse(bookMark);
        if (bookMark == null)  {
          localStorage.setItem('bookMark', JSON.stringify([]));
        } else {
            setBookMarkList(bookMark);
            const data = bookMark.find(data => data.id === question._id);
            data !== undefined ? setIsBookMark(true) : setIsBookMark(false);
        }
    }

    const downPage = () => {

        let result;
        for (let i=0; i<questions.length; i++) {
            if (index == questions[i]._id) {
                if (questions[i-1] === undefined) {
                    alert("??? ????????? ?????????.")
                } else {
                    result = questions[i-1]._id
                    setIndex(result)
                }
            }
        }  

    } 
    
    const upPage = () => {

        let result;
        for (let i=0; i<questions.length; i++) {
            if (index == questions[i]._id) {
                if (questions[i+1] === undefined) {
                    alert("????????? ????????? ?????????.")
                } else {
                    result = questions[i+1]._id
                    setIndex(result)
                }
            }
        }    
            
    }

    const bookMarkToggle = () => {
        if (question._id !== undefined) {
            if (isbookMark) {
                const index = bookMarkList.findIndex(data => data.id === question._id);
                bookMarkList.splice(index, 1);
            } else {
                bookMarkList.push({id : question._id, answer : question.answer});
            }
            bookMarkList.sort((a, b) => a.id - b.id);
            setBookMarkList([...new Set(bookMarkList)]);
            localStorage.setItem("bookMark", JSON.stringify(bookMarkList));
    
            setIsBookMark(!isbookMark);
        }

    }

    return (
        <Container>

            <div className='filter'>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>???????????????</InputLabel>
                    <Select label="???????????????" MenuProps={MenuProps} value={''}
                    >
                        {
                            bookMarkList.map(data => 
                                <MenuItem 
                                    onClick={() => setIndex(data.id)}
                                    key={data.id}
                                    value={data.id}
                                >
                                    {data.answer}
                                </MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </div>

            <div className={styles.detail}>
                
                <div className={styles.top}>
                    <div className={styles.side} >
                        { 
                        isLoading ?
                        <IconButton disabled>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                        :
                        <IconButton onClick={downPage}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                        }
                    </div>
                    <div className={styles.center}>
                        <IconButton onClick={bookMarkToggle}>
                            <StarIcon style={{color : isbookMark ? "rgb(250, 175, 0)" : ""}}/>
                        </IconButton>
                    </div>
                    <div className={styles.side}>
                        {
                        isLoading ?
                        <IconButton disabled>
                            <ArrowForwardIosIcon/>
                        </IconButton>
                        :
                        <IconButton onClick={upPage}>
                            <ArrowForwardIosIcon/>
                        </IconButton>
                        }
                    </div>
                </div>

                <hr />
                
                <div className={styles.question}>
                    <Textarea className={styles.title} value={question.title} readOnly disabled/>
                    <Textarea value={question.content} readOnly disabled/>
                    <Button variant="contained" onClick={()=>{setIsAnswer(!isAnswer)}}>????????????</Button>
                    <Textarea className={styles.answer} style={{visibility : isAnswer ? "" : "hidden"}}value={question.answer} readOnly disabled/>
                </div>

            </div>

        </Container>
    )
}

export default Detail;