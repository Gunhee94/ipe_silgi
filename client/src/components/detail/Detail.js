import styles from './Detail.module.css'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useEffect, useState } from 'react';

function Detail ({ index, setIndex }) {

    const [count, setCount] = useState(0);
    const [question, setQuestion] = useState({});    
    const [isAnswer, setIsAnswer] = useState(false);
    const [bookMarkList, setBookMarkList] = useState([]);
    const [isbookMark, setIsBookMark] = useState(false);
    const [bookFilter, setBookFilter] = useState(false);
  
    useEffect(() => {
        
        setIsAnswer(false);
        getCountQuestions();
        getQuestion();

    }, [index])

    const getCountQuestions = () => {
        fetch("/count")
        .then(res => res.json())
        .then(data => setCount(data.count));
    }

    const getQuestion = () => {
        fetch(`/list/${index}`)
        .then(res => res.json())
        .then(data => {
            setQuestion(data.question);
            getBookMark(data.question);  
        });
    }

    const getBookMark = (question) => {
        let bookMark = localStorage.getItem("bookMark");
        bookMark = JSON.parse(bookMark);
        if (bookMark == null)  {
          localStorage.setItem('bookMark', JSON.stringify([]));
        } else {
            setBookMarkList(bookMark);
            const data = bookMark.find(data => data === question._id);
            data !== undefined ? setIsBookMark(true) : setIsBookMark(false);
        }
    }

    const downPage = () => {
        //setIsAnswer(false);

        console.log(index, bookMarkList[index], "인덱스")

        let result;
        for (let i=bookMarkList.length; i>0; i--) {
            if (index == bookMarkList[i]) {
                result = bookMarkList[i-1]
            }
        }
        console.log(result, "결과")

        if (bookFilter) {
            index - 1 > 0 ? setIndex(result) : alert("첫 페이지 입니다.");
        } else {
            index - 1 > 0 ? setIndex(index - 1) : alert("첫 페이지 입니다.");

        }
        //로컬스토리지에 있는 아이디로 셋인덱스 해주기 
    } 
    
    const upPage = () => {
        //setIsAnswer(false);

        console.log(index, bookMarkList[index], "인덱스")

        let result;
        for (let i=0; i<bookMarkList.length; i++) {
            if (index == bookMarkList[i]) {
                result = bookMarkList[i+1]
            }
        }
        console.log(result, "결과")

        if (bookFilter) {
            index != bookMarkList.length ? setIndex(result) : alert("마지막 페이지 입니다.");
        } else {
            index != count ? setIndex(index + 1) : alert("마지막 페이지 입니다.");
        }
    }

    const answerToggle = () => {
        setIsAnswer(!isAnswer);
    }

    const bookMarkToggle = () => {
        
        if (isbookMark) {
            const index = bookMarkList.findIndex(data => data === question._id);
            bookMarkList.splice(index, 1);
        } else {
            bookMarkList.push(question._id);
        }
        bookMarkList.sort();
        setBookMarkList([...new Set(bookMarkList)]);
        localStorage.setItem("bookMark", JSON.stringify(bookMarkList));

        setIsBookMark(!isbookMark);
    }

    const bookFilterToggle = () => {
        setBookFilter(!bookFilter);

        if (!bookFilter == true) {
            setIndex(bookMarkList[0]);
        }

    }

    return (
        <div className='container'>
            <div className='filter'>
                <IconButton onClick={bookFilterToggle} size='small'>
                    {
                        bookFilter ? <FilterAltIcon/> : <FilterAltOffIcon/>
                    }
                    즐겨찾기
                </IconButton>
            </div>

            <div className={styles.detail}>
                <IconButton className={styles.left} onClick={downPage}>
                    <ArrowBackIosNewIcon/>
                </IconButton>
                <IconButton className={styles.center} onClick={bookMarkToggle}>
                    <StarIcon style={{color : isbookMark ? "rgb(250, 175, 0)" : ""}}/>
                </IconButton>
                <IconButton className={styles.right} onClick={upPage}>
                    <ArrowForwardIosIcon/>
                </IconButton>

                <hr />
            
                <div className={styles.title}>
                    {question.title}
                </div>
                <div>
                    {question.content}
                </div>
                <div>
                    <Button variant="contained" onClick={answerToggle}>정답보기</Button>
                </div>
                <div className={isAnswer ? "" : styles.hidden}>
                    {question.answer}
                </div>
            </div>

        </div>
    )
}

export default Detail;