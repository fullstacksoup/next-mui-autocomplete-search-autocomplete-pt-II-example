import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';
import AppLayout from '../components/AppLayout';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';
import { createContext, Fragment, useState } from "react";
import useSWR from 'swr';

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export const RootCompContext = createContext(null);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MainApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;  
  
  const { data, error } = useSWR('/api/getData', fetcher);
  
  const [darkState, setDarkState] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<any>([]);
  const [historyResults, setHistoryResults] = useState<any>([]);
  const [suggestionResults, setSuggestionResults] = useState<any>([]);
  const [maxRecordsReturned ] = useState<number>(10);
  const [selectProduct, setSelectProduct] = useState<any>(null);
  const [postsData, setPostsData] = useState<any>([]);
  const [photosData, setPhotosData] = useState<any>([]);
  const [filteredPostsData, setFilteredPostsData] = useState<any>([]);
  const [filteredPhotosData, setFilteredPhotosData] = useState<any>([]);
  const [filteredResultsCategories, setFilteredResultsCategories] = useState<any>([]);
  
  const [arrowKeyLateralListIndex, setArrowKeyLateralListIndex] = useState<number>(0);
  const [arrowKeyItemIndex, setArrowKeyItemIndex] = useState<number>(0);
  const [arrowKeyLateralItemIndex, setArrowKeyLateralItemIndex] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
    if(data) {
      setPostsData(data.posts);
      setPhotosData(data.photos);  
    }
  
    return () => {
      
    }
  }, [data])

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            // Purple and green play nicely together.
            main: '#4674c3',
            
          },
          secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
          },
          // dark: {
          //   // Purple and green play nicely together.
          //   main: grey[700],            
          // },
          
          // default: {
          //   // Purple and green play nicely together.
          //   main: grey[50]          
          // },
          warning: {
            // Purple and green play nicely together.
            main: red[300],            
          },
      
          mode: darkState? 'dark' : 'light',
          // mode: 'dark' ,
        },
       
        // breakpoints: {
        //   values: {
        //     xs: 0,
        //     sm: 600,
        //     md: 900,
        //     lg: 1700,
        //     xl: 1720,
        //   },
        // },
    }), [darkState]);

  const handleThemeChange = () => {
    setDarkState(!darkState);        
  
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
              
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          
          <NextNProgress
            color={theme.palette.mode==='light'?'#CD6155': '#CD6155'}
            startPosition={0.3}
            stopDelayMs={200}
            height={10}
            showOnShallow={true}
          />
             <RootCompContext.Provider
                value={{
                  searchTerm,
                  setSearchTerm,
                  filteredResults,
                  setFilteredResults,
                  historyResults,
                  setHistoryResults,
                  suggestionResults,
                  setSuggestionResults,
                  selectProduct,
                  setSelectProduct,
                  maxRecordsReturned,
                  postsData,
                  photosData,
                  filteredPostsData, 
                  setFilteredPostsData,
                  filteredPhotosData, 
                  setFilteredPhotosData,
                  filteredResultsCategories, 
                  setFilteredResultsCategories,
                  arrowKeyItemIndex, 
                  setArrowKeyItemIndex,
                  arrowKeyLateralItemIndex, 
                  setArrowKeyLateralItemIndex,
                  arrowKeyLateralListIndex, 
                  setArrowKeyLateralListIndex
                }}
              >
              <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
              <AppLayout handleThemeChange={handleThemeChange} darkState={darkState}  mainPage={                  
                <>         
                    <Component {...pageProps} /> 
                </>}
              />
              </div>
          </RootCompContext.Provider>
      

        </ThemeProvider>
      
    </CacheProvider>
  );
}

MainApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
  allProducts: PropTypes.array.isRequired,
};

