import React from 'react';
import styled from 'styled-components';

const Card = () => {
  const cardsData = [
    { image: 'https://media.istockphoto.com/id/493958679/photo/audience-at-the-conference-hall.jpg?s=612x612&w=0&k=20&c=xd25jricV0WozAldp8zC0wthPmKCzZcVrzf8bM1U8EY=', color: '142, 249, 252' },
    { image: 'https://media.istockphoto.com/id/501387734/photo/dancing-friends.jpg?s=612x612&w=0&k=20&c=SoTKXXMiJYnc4luzJz3gIdfup3MI8ZlROFNXRBruc10=', color: '142, 252, 204' },
    { image: 'https://media.istockphoto.com/id/1371940128/photo/multiracial-friends-taking-big-group-selfie-shot-smiling-at-camera-laughing-young-people.jpg?s=612x612&w=0&k=20&c=FPs-C92zbN6RkHnPG4Fl9zyP2-HZWGy9Prdt46Yn-IY=', color: '142, 252, 157' },
    { image: 'https://media.istockphoto.com/id/1165055006/photo/nice-looking-attractive-gorgeous-glamorous-elegant-stylish-cheerful-cheery-positive-girls-and.jpg?s=612x612&w=0&k=20&c=zXqufRf_lhy8U-vVXoqlxnlVaFeAgk-_bx-CWx9E3F8=', color: '215, 252, 142' },
    { image: 'https://media.istockphoto.com/id/1194783078/photo/social-networking-service-concept-streaming-video-video-library.jpg?s=612x612&w=0&k=20&c=0yXlhOyAkb8HBU_wmL40v7ULFJghUSmcN9fsyZgm300=', color: '252, 252, 142' },
    { image: 'https://media.istockphoto.com/id/160836693/photo/celebration.jpg?s=612x612&w=0&k=20&c=TEpNxE955P6EOSvL4ULwWVYs6F6ekGr4-7b2Z4CFCCk=', color: '252, 208, 142' },
    { image: 'https://media.istockphoto.com/id/1181169462/photo/are-you-ready-to-party.jpg?s=612x612&w=0&k=20&c=GT9vWVxgOLJeuJv-jDhmLj480RLGKtkDcBOq-WX7liY=', color: '252, 142, 142' },
    { image: 'https://media.istockphoto.com/id/826608862/photo/food-catering-cuisine-culinary-gourmet-buffet-party-concept.jpg?s=612x612&w=0&k=20&c=F4XhpOqYWL-15jf2IPnpfzyBOLh90ZE2rsC2DZcnCpo=', color: '252, 142, 239' },
    { image: 'https://media.istockphoto.com/id/1137781483/photo/black-male-guitarist-singing-and-playing-acoustic-guitar-on-stage.jpg?s=612x612&w=0&k=20&c=FumC-iuwoUWijPo6wcx4V162mV5PB8g7FQGOR7A1a88=', color: '204, 142, 252' },
    { image: 'https://media.istockphoto.com/id/2098359215/photo/digital-marketing-concept-businessman-using-laptop-with-ads-dashboard-digital-marketing.jpg?s=612x612&w=0&k=20&c=OdQP1rq-YcNN2nIuC8slL1BJKEwdYb7rT5mqTUNSTZQ=', color: '142, 202, 252' },
  ];

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="inner" style={{ '--quantity': cardsData.length }}>
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{
                '--index': index,
                '--color-card': card.color,
              }}
            >
              <div className="img">
                <img src={card.image} alt={`Event ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible; /* Ensure all cards are visible */
    background:rgba(15, 15, 15, 0.89);
  }

  .inner {
    --w: 180px;
    --h: 280px;
    --translateZ: 300px; /* Increased for larger circular radius */
    --rotateX: -15deg;
    --perspective: 1500px; /* Increased for better 3D depth */
    --quantity: initial; /* Uses style prop value */
    position: absolute;
    width: var(--w);
    height: var(--h);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) perspective(var(--perspective)) rotateX(var(--rotateX));
    transform-style: preserve-3d;
    animation: rotating 20s linear infinite;
  }

  @keyframes rotating {
    from {
      transform: translate(-50%, -50%) perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0deg);
    }
    to {
      transform: translate(-50%, -50%) perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(360deg);
    }
  }

  .card {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(var(--color-card));
    border-radius: 12px;
    overflow: hidden;
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
    transform-style: preserve-3d; /* Ensures 3D for each card */
    backface-visibility: visible; /* Changed to visible to show back faces */
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

`;

export default Card;

