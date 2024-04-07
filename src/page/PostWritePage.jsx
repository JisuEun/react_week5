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

const PhotoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  margin-top: 8px;
  background: #f2f2f2;
  border-radius: 4px;
`;

const DeleteButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
`;

function PostWritePage(props) {
    const navigate = useNavigate();
    // useLocation을 사용하여 location 객체에 접근
    const location = useLocation();

    // 상태 정의
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [existingPhotos, setExistingPhotos] = useState([]); // 현재 서버에 있는 사진들
    const [newPhotos, setNewPhotos] = useState([]); // 추가할 새 사진들
    const [deletedPhotos, setDeletedPhotos] = useState([]);

    // `isEdit`와 `postId` 상태
    const [isEdit, setIsEdit] = useState(false);
    const [postId, setPostId] = useState(null);

    // 파일 입력을 위한 ref 생성
    const fileInputRef = useRef(null);

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
                    const { title, author, content, Photos } = response.data;
                    setTitle(title);
                    setAuthor(author);
                    setContent(content);
                    setExistingPhotos(Photos.map(photo => ({
                        ...photo,
                        url: `http://localhost:3001/rest-api/uploads/${photo.filename}`
                    })));
                })
                .catch(error => {
                    console.error('Error fetching post data:', error);
                    alert('게시글을 불러오는 데 실패했습니다.');
                });
        }
    }, [location]); // location이 변경될 때마다 useEffect가 실행됨

    // 사진 삭제 함수
    const handleDeleteExistingPhoto = async (photoId) => {
        try {
            await axios.delete(`http://localhost:3001/rest-api/photos/${photoId}`);
            setExistingPhotos(existingPhotos.filter(photo => photo.id !== photoId));
        } catch (error) {
            alert('사진을 삭제하는데 실패했습니다.');
            console.error('Error deleting photo:', error);
        }
    };

    // 버튼 클릭 시 숨겨진 file input 실행
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleNewFileChange = (event) => {
        setNewPhotos([...newPhotos, ...event.target.files]);
    };

    const handleDeleteNewPhoto = (index) => {
        setNewPhotos(newPhotos.filter((_, i) => i !== index));
    };

    // 사진 삭제 기능
    const removePhoto = (index) => {
        setNewPhotos(currentPhotos => currentPhotos.filter((_, i) => i !== index));
    };

    const handleFileChange = (event) => {
        // 새로 선택한 사진
        const selectedPhotos = Array.from(event.target.files);

        // 이미 선택된 사진에 새로 선택한 사진을 더해서 2개를 초과하는지 확인
        if (newPhotos.length + selectedPhotos.length > 2) {
            alert('최대 2개의 사진만 업로드할 수 있습니다.');
            // 초과하는 경우, 새로 선택한 사진은 무시하고, 기존의 사진만 남깁니다.
            return;
        }

        // 새로 선택한 사진들을 기존의 사진 배열에 추가합니다.
        setNewPhotos([...newPhotos, ...selectedPhotos]);
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
        newPhotos.forEach(photo => {
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
                <Header />
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
                        onClick={handleFileButtonClick}
                        disabled={existingPhotos.length + newPhotos.length >= 2}>사진 선택</Button>
                    <HiddenFileInput
                        type='file'
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    <HighlightText>한 번에 2개의 사진까지 선택할 수 있습니다.</HighlightText>
                    <div>
                        {existingPhotos.map((photo, index) => (
                            <PhotoItem key={photo.id}>
                                <img src={photo.url} alt={`photo-${index}`} />
                                <DeleteButton onClick={() => handleDeleteExistingPhoto(photo.id)}>X</DeleteButton>
                            </PhotoItem>
                        ))}
                        {newPhotos.map((photo, index) => (
                            <PhotoItem key={index}>
                                {photo.name}
                                <DeleteButton onClick={() => removePhoto(index)}>X</DeleteButton>
                            </PhotoItem> // 선택된 각 파일의 이름을 표시합니다.
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