import styled from 'styled-components';

const UserbarUl = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;

    @media screen and (max-width: 980px) {
        display: none;
    }

    > li:not(:last-child) {
        margin-right: 1.5rem;
    }
`;

export default UserbarUl;