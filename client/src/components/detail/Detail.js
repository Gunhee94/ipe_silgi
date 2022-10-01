import styles from './Detail.module.css'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Textarea from '@mui/joy/Textarea';
import { useEffect, useState } from 'react';

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
            fetch(`/list/${index}`)
            .then(res => res.json())
            .then(data => {
                setQuestion(data.question);
                getBookMark(data.question);
                setIndex(data.question._id)
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
                    alert("첫 페이지 입니다.")
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
                    alert("마지막 페이지 입니다.")
                } else {
                    result = questions[i+1]._id
                    setIndex(result)
                }
            }
        }    
            
    }

    const bookMarkToggle = () => {
        
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

    return (
        <div className='container'>

            <div className={styles.detail}>
                {
                    isLoading ?
                    <IconButton className={styles.side}/>
                    :
                    <IconButton className={styles.side} onClick={downPage}>
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                }
                
                <IconButton className={styles.center} onClick={bookMarkToggle}>
                    <StarIcon style={{color : isbookMark ? "rgb(250, 175, 0)" : ""}}/>
                </IconButton>
                {
                    isLoading ?
                    <IconButton className={styles.side}/>
                    :
                    <IconButton className={styles.side} onClick={upPage}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                }

                <hr />
            
                <Textarea className={styles.title} value={question.title} readOnly disabled/>
                <Textarea value={question.content} readOnly disabled/>
                <Button variant="contained" onClick={()=>{setIsAnswer(!isAnswer)}}>정답보기</Button>
                <Textarea className={styles.border} style={{visibility : isAnswer ? "" : "hidden"}} value={question.answer} readOnly disabled/>
            </div>

            <List component="nav"  
                sx={{
                    width: '100%',
                    maxWidth: 200,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300
                }}
                subheader={
                    <ListSubheader component="div">
                    북마크목록
                    </ListSubheader>
                }
            >

            {
                bookMarkList.map(data => 
                    <ListItemButton
                        onClick={() => setIndex(data.id)}
                        key={data.id}
                    >
                        <ListItemText className="bookMark"  primary={data.answer} />
                    </ListItemButton>
                )
            }

            </List>

        </div>
    )
}

export default Detail;