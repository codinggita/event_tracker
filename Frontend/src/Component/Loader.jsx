import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <span className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed; /* Center me lane ke liye */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7); /* Dark overlay effect */
  z-index: 9999; /* Sabse upar rahega */

  .loader {
    position: relative;
    width: 108px;
    display: flex;
    justify-content: space-between;
  }
  .loader::after,
  .loader::before {
    content: "";
    display: inline-block;
    width: 48px;
    height: 48px;
    background-color: #fff;
    background-image: radial-gradient(circle 14px, #0d161b 100%, transparent 0);
    background-repeat: no-repeat;
    border-radius: 50%;
    animation: eyeMove 10s infinite, blink 10s infinite;
  }

  @keyframes eyeMove {
    0%, 10% { background-position: 0px 0px; }
    13%, 40% { background-position: -15px 0px; }
    43%, 70% { background-position: 15px 0px; }
    73%, 90% { background-position: 0px 15px; }
    93%, 100% { background-position: 0px 0px; }
  }

  @keyframes blink {
    0%, 10%, 12%, 20%, 22%, 40%, 42%, 60%, 62%, 70%, 72%, 90%, 92%, 98%, 100% { height: 48px; }
    11%, 21%, 41%, 61%, 71%, 91%, 99% { height: 18px; }
  }
`;

export default Loader;
