import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const HeaderContainer = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    background-color: #fff; /* 배경색: 흰색 */
    cursor: default; /* 커서: 기본 */
`;

const Title = styled.h1`
    color: #333; /* 글자색: 검은색 */
    margin: 0 0 12px 0; /* 제목-이름 간격 */
`;

const Name = styled.div`
    font-size: 16px; /* 글자 크기 */
    color: #333; /* 글자색: 검은색 */
    text-align: right; /* 오른쪽 정렬 */
    width: 100%; /* 부모 컨테이너와 너비 같게 조정 */
`;

function Header(props) {
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate('/'); // 헤더 클릭 시 메인 페이지로 이동하기 위해 훅 사용
    };

    return (
        <HeaderContainer onClick={redirectToHome}>
            <Title>고급 웹 프로그래밍 과제3</Title>
            <Name>컴퓨터학부 2020112037 은지수</Name>
        </HeaderContainer>
    );
}

export default Header;