import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../component/ui/Button';
import List from '../component/list/List';
import Header from '../component/ui/Header';

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

function MainPage(props) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    // 게시물 목록 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 서버의 엔드포인트 주소 업데이트
                const response = await fetch('http://localhost:3001/rest-api/posts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPosts(data); // 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);
    return (
        <Wrapper>
            <Container>
                <Header/>
                <Button
                    title='새 글 작성'
                    onClick={() => {
                        navigate('/post-write');
                    }}
                />

                <List
                    posts={posts}
                    onClickItem={(item) => {
                        navigate(`/post/${item.id}`);
                    }}
                />
            </Container>
        </Wrapper>
    );
}

export default MainPage;
