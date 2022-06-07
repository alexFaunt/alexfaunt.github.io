import React from 'react';
import { useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useQueryParam, StringParam } from "use-query-params";

import WaterAid from '../atoms/water-aid';
import { ONE_DAY, extractDateString } from '../helpers';

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

const DateTab = styled.a`
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

const Disclaimer = styled.p`
  font-size: 0.6rem;
  color: grey;
`;

const ALL = 'all';

const Home = () => {
  const yesterdayPath = extractDateString(new Date(Date.now() - ONE_DAY)).replace(/-/g, '/');
  const year = yesterdayPath.replace(/\/.*$/, '');

  const params = new URLSearchParams(window.location.search);

  const targetDate = params.get('date') === ALL ? ALL : yesterdayPath;
  const targetPath = targetDate === ALL ? year : targetDate;

  const onYesterdayClick = useCallback(() => {
    setParamDate(yesterdayPath);
  }, [setParamDate, yesterdayPath])
  const onAllClick = useCallback(() => {
    setParamDate(ALL);
  }, [setParamDate])

  return (
    <div>
      <GlobalStyle />
      <Title>Glastolapse!</Title>
      <SubTitle>Timelapse of the <BBCLink href="https://www.bbc.co.uk/events/glastonbury/webcam">BBC glastonbury webcam</BBCLink></SubTitle>

      <DonateBlock>
        <span>If you like this then</span><DonateLink href="https://www.wateraid.org/uk/donate">donate to <WaterAidLogo /></DonateLink>
      </DonateBlock>

      <Tabs>
        <DateTab href='/' selected={targetDate !== ALL}>yesterday</DateTab>
        <DateTab href={`/?date=${ALL}`} selected={targetDate === ALL}>28th May to yesterday</DateTab>
      </Tabs>

      <Caption>Zoomed view of the central festival</Caption>
      <Video className="video" autoPlay muted controls loop>
        <source src={`https://videos.glastolapse.com/${targetPath}/pyramid.mp4`} type="video/mp4" />
      </Video>

      <Caption>Full site panorama</Caption>
      <Video className="video" muted controls loop>
        <source src={`https://videos.glastolapse.com/${targetPath}/panorama.mp4`} type="video/mp4" />
      </Video>

      <Disclaimer>
        DISCLAIMER: This site is not affiliated with WaterAid, the BBC, Glastonbury Festivals, panomax, or any other company. The content here is created using images readily accessible on the web, I do not claim ownership or copyright over the source.
      </Disclaimer>
    </div>
  )
}

export default Home;
