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
  font-size: 1.2rem;
`;

const DateTab = styled.button`
  font-size: 1rem;
  padding: 0.2rem 0.1rem 0.6rem;
  margin: 0 0.5rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  position: relative;

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
`;

const DonateBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 1.2rem;
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

const Caption = styled.caption`
  display: block;
  margin: 0.2rem;
`

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.8rem;
`;

const ALL = 'all';

const Home = () => {
  const yesterdayPath = extractDateString(new Date(Date.now() - ONE_DAY)).replace(/-/g, '/');
  const year = yesterdayPath.replace(/\/.*$/, '');

  const [paramDate, setParamDate] = useQueryParam('date', StringParam);

  const targetDate = (paramDate || yesterdayPath).toLowerCase();
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
      <SubTitle>Timelapse of the <BBCLink href="https://www.bbc.co.uk/events/glastonbury/webcam">BBC glastonbury webcam</BBCLink> - I claim no rights over the content</SubTitle>

      <DonateBlock>
        <span>If you like this then</span><DonateLink href="https://www.wateraid.org/uk/donate">donate to <WaterAidLogo /></DonateLink>
      </DonateBlock>

      <Tabs>
        <DateTab selected={targetDate === yesterdayPath} onClick={onYesterdayClick}>yesterday</DateTab>
        <DateTab selected={targetDate === ALL} onClick={onAllClick}>28th May to yesterday</DateTab>
      </Tabs>

      <Caption>Zoomed view of the central festival</Caption>
      <Video className="video" autoPlay muted controls>
        <source src={`/videos/${targetPath}/pyramid.mp4`} type="video/mp4" />
      </Video>

      <Caption>Full site panorama</Caption>
      <Video className="video" muted controls>
        <source src={`/videos/${targetPath}/panorama.mp4`} type="video/mp4" />
      </Video>
    </div>
  )
}

export default Home;
