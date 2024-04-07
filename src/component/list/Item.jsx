import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center; // 세로 중앙 정렬
    width: calc(100% - 32px);
    padding: 16px;
    border: 1px solid grey;
    border-radius: 8px;
    cursor: pointer;
    background: white;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column; // 아이템들을 세로로 배열
  justify-content: center; // 세로 축에서 아이템들을 중앙에 배치
  flex: 1; // Flex 아이템들이 컨테이너 공간을 동등하게 나누도록 설정
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  text-align: left;
  
  &:last-child {
    margin-right: 0;
    text-align: right;
  }
`;

function Item(props) {
    const { index, post, onClick } = props;

    return (
        <Wrapper onClick={onClick}>
            <Info>{index + 1}</Info>
            <Info>제목: {post.title}</Info>
            <Info>|작가: {post.author}</Info>
            <Info>|작성시간: {post.createdAt}</Info>
        </Wrapper>
    );
}

export default Item;
