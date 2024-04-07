import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../component/ui/Button';
import Header from '../component/ui/Header';
import axios from 'axios';

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

const PostContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
`;

const TitleText = styled.p`
    font-size: 28px;
    font-weight: 500;
`;

const ContentText = styled.p`
    font-size: 20px;
    line-height: 32px;
    white-space: pre-wrap;
`;

const AuthorAndTimeContainer = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Author = styled.p`
    font-size: 16px;
    color: black;
    margin: 0;
`;

const DateTime = styled.p`
    font-size: 16px;
    color: grey;
    margin: 0;
`;

const Divider = styled.hr`
    border: none;
    height: 1px;
    background-color: grey; /* 구분선 색: 회색 */
    margin: 16px 0; /* 구분선 위아래 여백 */
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%; // 버튼 그룹의 너비를 Container에 맞춤
`;

const LeftButtonGroup = styled.div`
`;

const RightButtonGroup = styled.div`
    display: flex;
    gap: 10px; // 버튼 사이 간격 조정
`;


function PostViewPage(props) {

    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    // 서버로부터 게시물 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/rest-api/posts/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                navigate('/'); // 에러가 발생하면 메인 페이지로 리다이렉트
            }
        };

        fetchPost();
    }, [postId, navigate]);

    const handleDelete = async () => {
        const isConfirmed = window.confirm('정말로 글을 삭제하시겠습니까?');
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/rest-api/posts/${postId}`);
                navigate('/'); // 삭제 후 메인 페이지로 리다이렉트
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('글을 삭제하는 데 실패했습니다.');
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <Wrapper>
            <Container>
                <Header/>
                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <AuthorAndTimeContainer>
                        <Author>글쓴이: {post.author}</Author>
                        <DateTime>{post.createdAt}</DateTime>
                    </AuthorAndTimeContainer>
                    <Divider /> {/* 구분선 추가 */}
                    <ContentText>{post.content}</ContentText>
                </PostContainer>
                <ButtonGroup>
                <LeftButtonGroup>
                    <Button
                        title='목록으로'
                        onClick={() => {
                            navigate('/');
                        }}
                    />
                </LeftButtonGroup>
                <RightButtonGroup>
                <Button
                    title='수정'
                    onClick={() => {
                        navigate(`/post-write?postId=${postId}&edit=true`);
                    }}
                />
                    <Button
                        title='삭제'
                        onClick={handleDelete}
                    />
                </RightButtonGroup>
            </ButtonGroup>
                
            </Container>
        </Wrapper>
    );
}

export default PostViewPage;
