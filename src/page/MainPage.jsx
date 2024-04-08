import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../component/ui/Button';
import List from '../component/list/List';
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

function MainPage(props) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    // 게시물 목록 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // axios.get을 사용하여 데이터 요청
                const response = await axios.get('http://54.161.32.32/rest-api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []); // 의존성 배열을 비워서 마운트 시에만 호출되도록 함
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
