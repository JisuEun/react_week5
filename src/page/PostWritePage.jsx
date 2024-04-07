import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TextInput from '../component/ui/TextInput';
import Button from '../component/ui/Button';
import Header from '../component/ui/Header';
import axios from 'axios';

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

const HighlightText = styled.p`
    background-color: #f0f0f0; /* 형광펜 효과를 위한 배경색 */
    padding: 5px; /* 텍스트 주변에 패딩 추가 */
    border-radius: 5px; /* 모서리를 약간 둥글게 */
    display: inline-block; /* 배경색을 텍스트 주위만 적용 */
    margin-top: 10px; /* 위쪽 여백 추가 */
    font-size: 14px;
`;

const HiddenFileInput = styled.input`
    display: none;
`

function PostWritePage(props) {
    const navigate = useNavigate();
    // useLocation을 사용하여 location 객체에 접근
    const location = useLocation();

    // 상태 정의
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState([]);

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
            axios.get(`http://localhost:3001/rest-api/posts/${postIdFromQuery}`)
                .then(response => {
                    const { title, author, content } = response.data;
                    setTitle(title);
                    setAuthor(author);
                    setContent(content);
                })
                .catch(error => {
                    console.error('Error fetching post data:', error);
                    alert('게시글을 불러오는 데 실패했습니다.');
                });
        }
    }, [location]); // location이 변경될 때마다 useEffect가 실행됨

    // 파일 입력을 위한 ref 생성
    const fileInputRef = useRef(null);
    // 버튼 클릭 시 숨겨진 file input 실행
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        if (event.target.files.length>2) {
            alert('최대 2개의 사진만 업로드할 수 있습니다.');
            setPhotos([...event.target.files].slice(0,2));
        }else {
        setPhotos([...event.target.files]);
        }
    };

    // 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {
        if (!title.trim() || !author.trim() || !content.trim()) {
            alert('모든 필드를 채워주세요!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('content', content);
        
        // 사진이 있다면 FormData에 추가
        photos.forEach(photo => {
            formData.append('photos', photo); // 각 사진 파일 추가
        });
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const url = `http://localhost:3001/rest-api/posts${isEdit ? `/${postId}` : ''}`;
            const method = isEdit ? 'put' : 'post';
            await axios[method](url, formData, config);

            navigate('/');
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert('글을 저장하는 데 실패했습니다.');
        }
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
                <InputContainer>
                        <Button 
                            title="이미지 업로드"
                            onClick={handleFileButtonClick}>사진 선택</Button>
                        <HiddenFileInput
                            type='file'
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <HighlightText>한 번에 2개의 사진까지 선택할 수 있습니다.</HighlightText>
                        <div>
                        {photos.map((photo, index) => (
            <div key={index}>{photo.name}</div> // 선택된 각 파일의 이름을 표시합니다.
        ))}
                        </div>
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