import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 8px 16px;
    height: 40px;
    font-size: 16px;
    border-width: 1px;
    border-radius: 20px;
    cursor: pointer;
    background-color: white; /* 배경색: 흰색 */
    color: black; /* 글자색: 검은색 */
    border-color: black; /* 테두리색: 검은색 */
    transition: background-color 0.3s, color 0.3s; /* 애니메이션 */

    &:hover {
        background-color: black; /* 마우스 오버 시 배경색 반전 */
        color: white; /* 마우스 오버 시 글자색 반전 */
    }

    &:focus {
        outline: none;
    }

    &:disabled {
        background-color: grey; /* 비활성화 상태의 배경색 */
        color: #9e9e9e; /* 비활성화 상태의 글자색 */
        border-color: #9e9e9e; /* 비활성화 상태의 테두리색 */
        cursor: not-allowed; /* 비활성화 상태의 커서 스타일 */
      }
`;

function Button(props) {
    const { title, onClick, disabled } = props;

    return <StyledButton onClick={onClick} disabled={disabled}>
        {title || "button"}
    </StyledButton>;
}

export default Button;