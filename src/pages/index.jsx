import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import WaterAid from '../atoms/water-aid';
import YouTube from 'react-youtube';
import { useEffect } from 'react';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: arial;
  }
`;

const title = `
  text-align: center;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  ${title}
  margin-top: 1rem;
`;

const SubTitle = styled.h2`
  ${title}
  font-size: 1rem;
`;

const DateTab = styled.button`
  font-size: 1rem;
  padding: 0.2rem 0.1rem 0.6rem;
  margin: 0 0.5rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  position: relative;
  transition: all 0.2s;
  text-decoration: none;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.3rem;
    background: ${({ selected }) => selected ? 'blue' : 'transparent' };
  }

  &:hover {
    &::after {
      background: ${({ selected }) => selected ? 'blue' : 'rgba(0,0,255,0.15)' };
    }
  }
`;

const DonateBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const DonateLink = styled.a`
  display: inline-block;
  margin-left: 0.25rem;
`;

const WaterAidLogo = styled(WaterAid)`
  height: 2em;
`;

const Video = styled.video`
  width: 100%;
  margin-bottom: 2rem;
`;

const BBCLink = styled.a`
`;

const Caption = styled.span`
  display: block;
  margin: 0.2rem;
  font-size: 0.8rem;
`

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.8rem;
`;

const Apology = styled.p`
  font-size: 0.8rem;
  color: grey;
`

const Disclaimer = styled.p`
  font-size: 0.6rem;
  color: grey;
`;

const PyramidOuter = styled.div`
  width: 100%;
  position: relative;

  &::after {
    content: '';
    display: block;
    padding-bottom: ${(100 * 2048) / 3924}%; /* video resolution */
  }
`;

const PanoramaOuter = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 2rem;

  &::after {
    content: '';
    display: block;
    padding-bottom: ${(100 * 800) / 4090}%; /* video resolution */
  }
`;

const StyledYoutube = styled(YouTube)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .video-iframe {
    width: 100%;
    height: 100%;
  }
`;

// TODO - query youtube API and figure these out using the channel id
const DAY_PYRAMID_ID = 'dZSUn9X-KpA';
const FULL_PYRAMID_ID = 'fS3MtOTlcjs';

const DAY_PANORAMA_ID = 'VmHiO0iN_HU';
const FULL_PANORAMA_ID = 'VGysX7HJOZs';

const youtubeOpts = {
  playerVars: {
    autoplay: 1,
    loop: 1,
    modestbranding: 1,
    rel: 0,
    origin: 'https://glastolapse.com',
    muted: 1,
  },
};

const Home = ({ location }) => {
  // TODO tried to put this in params but failed, gatsby static build is weird about it
  const [showAll, setShowAll] = useState(false);

  const pyramidId = showAll ? FULL_PYRAMID_ID : DAY_PYRAMID_ID;
  const panoramaId = showAll ? FULL_PANORAMA_ID : DAY_PANORAMA_ID;

  return (
    <div>
      <GlobalStyle />
      <Title>Glastolapse!</Title>
      <SubTitle>Timelapse of the <BBCLink href="https://www.bbc.co.uk/events/glastonbury/webcam">BBC glastonbury webcam</BBCLink></SubTitle>

      <DonateBlock>
        <span>If you like this then</span><DonateLink href="https://www.wateraid.org/uk/donate">donate to <WaterAidLogo /></DonateLink>
      </DonateBlock>

      <Tabs>
        <DateTab onClick={() => setShowAll(false)} selected={!showAll}>yesterday</DateTab>
        <DateTab onClick={() => setShowAll(true)} selected={showAll}>1st June to yesterday</DateTab>
      </Tabs>

      {/* TODO hacky key swapping to force re-render. Just swapping out the url doesn't restart video */}
      <div key={showAll ? 'all' : 'yday' }>
        <Caption>Zoomed view of the pyramid area</Caption>
        <PyramidOuter>
          <StyledYoutube iframeClassName='video-iframe' videoId={pyramidId} opts={youtubeOpts} />
        </PyramidOuter>

        <Caption>Full site panorama</Caption>
        <PanoramaOuter>
          <StyledYoutube iframeClassName='video-iframe' videoId={panoramaId} opts={youtubeOpts} />
        </PanoramaOuter>
      </div>
      <Apology>
        Sorry for the youtube links - the raw files are huge and struggling to host them effectively
      </Apology>

      <Disclaimer>
        DISCLAIMER: This site is not affiliated with WaterAid, the BBC, Glastonbury Festivals, panomax, or any other company. The content here is created using images readily accessible on the web, I do not claim ownership or copyright over the source.
      </Disclaimer>
    </div>
  )
}

export default Home;
