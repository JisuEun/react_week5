import React, { useState } from 'react';
import styled from 'styled-components';
import Item from './Item';
import Pagination from 'react-js-pagination';
import Button from '../ui/Button';
import './PaginationStyles.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px; /* 모서리 둥글게 */
  border: 1px solid black;
  padding: 20px; /* 내부 여백 추가 */
  background: white; /* 배경색 설정 */
  margin: 0px; /* 외부 여백 추가 */
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end; // 페이지네이션 개수 버튼 우측 정렬
  gap: 10px; // 버튼 간 간격
`;

const ItemsPerPageLabel = styled.span`
  font-size: 18px;
  margin-right: 20px;
`;

const ItemsPerPageSelector = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  gap: 10px;
`;

function List({ posts, onClickItem }) {
  const [activePage, setActivePage] = useState(1);
  const [itemsCountPerPage, setItemsCountPerPage] = useState(10);
  const totalItemsCount = posts.length;
  const indexOfLastPost = activePage * itemsCountPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsCountPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleItemsCountChange = (newCount) => {
    setItemsCountPerPage(newCount);
    setActivePage(1); // 아이템 개수 변경 시 첫 페이지로 리셋
  };

  return (
    <Wrapper>
      <ItemsPerPageSelector>
        <ItemsPerPageLabel>목록</ItemsPerPageLabel>
        <ButtonsContainer>
          {['10', '20', '30'].map((count) => (
            <Button key={count} title={`${count}개`} onClick={() => handleItemsCountChange(Number(count))} />
          ))}
        </ButtonsContainer>
        
      </ItemsPerPageSelector>
      {currentPosts.map((post, index) => (
        <Item key={post.id} index={indexOfFirstPost+index} post={post} onClick={() => onClickItem(post)} />
      ))}
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemCLass="page-item"
        linkClass="page-link"
        innerClass="pagination"
      />
    </Wrapper>
  );
}

export default List;
