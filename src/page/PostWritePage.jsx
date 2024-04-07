import React, { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Header from '../ui/Header';

const Wrapper = styled.div`
    padding: 16px;
    display: flex;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

const InputContainer = styled.div`
    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

function PostWritePage(props) {
    const navigate = useNavigate();
    // useLocation을 사용하여 location 객체에 접근
    const location = useLocation();

    // 상태 정의
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    // `isEdit`와 `postId` 상태
    const [isEdit, setIsEdit] = useState(false);
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        // queryParams 정의
        const queryParams = new URLSearchParams(location.search);
        const postIdFromQuery = queryParams.get('postId');
        const isEditFromQuery = queryParams.get('edit') === 'true';
    
        // 상태 업데이트
        setPostId(postIdFromQuery);
        setIsEdit(isEditFromQuery);
    
        // 수정 모드이고 postId가 있을 경우에만 서버로부터 데이터를 가져옴
        if (isEditFromQuery && postIdFromQuery) {
            fetch(`http://localhost:3001/rest-api/posts/${postIdFromQuery}`)
                .then(response => response.json())
                .then(data => {
                    setTitle(data.title);
                    setAuthor(data.author);
                    setContent(data.content);
                })
                .catch(error => {
                    console.error('Error fetching post data:', error);
                    alert('게시글을 불러오는 데 실패했습니다.');
                });
        }
    }, [location]); // location이 변경될 때마다 useEffect가 실행됨

    // 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {
        if (!title.trim() || !author.trim() || !content.trim()) {
            alert('모든 필드를 채워주세요!');
            return;
        }

        const postInfo = { title, author, content };
        const url = `http://localhost:3001/rest-api/posts${isEdit ? `/${postId}` : ''}`;
        console.log(url);
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postInfo),
            });

            if (response.ok) {
                navigate('/');
            } else {
                throw new Error('Failed to save the post.');
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert('글을 저장하는 데 실패했습니다.');
        }
        console.log(postId, isEdit);
    };

    return (
        <Wrapper>
            <Container>
                <Header/>
                <InputContainer>
                    <TextInput
                        height={20}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                    />
                </InputContainer>
                
                <InputContainer>
                    <TextInput
                        height={20}
                        placeholder="글쓴이를 입력하세요"
                        value={author}
                        onChange={(event) => {
                            setAuthor(event.target.value);
                        }}
                        fontStyle="italic"
                        color="grey"
                    />
                </InputContainer>

                <InputContainer>
                    <TextInput
                        height={480}
                        placeholder="자유롭게 적어보아요"
                        value={content}
                        onChange={(event) => {
                            setContent(event.target.value);
                        }}
                        fontStyle="italic"
                        color="grey"
                    />
                </InputContainer>


                <ButtonContainer>
                    <Button
                        title='글 작성하기'
                        onClick={handleSubmit} // onClick 핸들러를 handleSubmit 함수로 변경
                    />
                </ButtonContainer>
            </Container>
        </Wrapper>
    );
}

export default PostWritePage;