import * as React from "react";
import { useContext, useRef } from "react";
import {RootCompContext} from "@/pages/_app";
import { alpha, styled } from '@mui/material/styles';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Stack } from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { useRouter } from 'next/router'
import SearchResultsGrid from "./SearchResultsGrid";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',

  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {    
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '80ch',
    },
  },
}));

const SearchClearIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 1,
  cursor: 'pointer',
  zIndex: 99,
}));

export default function LayoutSearchField(props) {
  const router = useRouter()
  var searchInputRef = useRef();
 
  const [showResults, setShowResults] = React.useState(false);
  const {
    searchTerm,
    setSearchTerm,        
    postsData,
    albumData,    
    setFilteredPostsData,    
    filteredPostsData,
    setFilteredAlbumsData,    
    filteredAlbumsData,
    setFilteredResultsCategories,
    arrowKeyItemIndex, 
    setArrowKeyItemIndex,
    arrowKeyLateralItemIndex, 
    setArrowKeyLateralItemIndex,
    arrowKeyLateralListIndex, 
    setArrowKeyLateralListIndex,
    selectProduct, 
    setSelectProduct
  } = useContext(RootCompContext);
       
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  const arrowLeftPressed = useKeyPress('ArrowLeft');
  const arrowRightPressed = useKeyPress('ArrowRight');
  const enterKeyPressed = useKeyPress('Enter');
  const [ counter, setCounter ] = React.useState(0);
  const [ displaySearchTerm, setDisplaySearchTerm ] = React.useState('');

  //*************************************************************************************************************************** */
  //*  U P   A N D   D O W N   A R R O W S    P R E S S E D 
  //*************************************************************************************************************************** */

  React.useEffect(() => {
    if (arrowUpPressed) {
      console.log('arrowUpPressed');
      if(arrowKeyItemIndex > 0) {
        setCounter(counter - 1)
        console.log('up key counter', counter);
        console.log('up key arrowKeyItemIndex', arrowKeyItemIndex);
        const index = arrowKeyItemIndex - 1;
        setArrowKeyItemIndex(arrowKeyItemIndex - 1);
        console.log('up key', index);
      }
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowUpPressed]);

  React.useEffect(() => {
    if (arrowDownPressed) {
      console.log('arrowDownPressed');
      if(arrowKeyItemIndex <= 15) {
        setCounter(counter + 1)
        console.log('down key counter', counter);
        console.log('down key arrowKeyItemIndex', arrowKeyItemIndex);
        const index = arrowKeyItemIndex + 1;
        setArrowKeyItemIndex(arrowKeyItemIndex + 1);
        console.log('down key', index);
      }      
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowDownPressed]);


  React.useEffect(() => {
    if (arrowLeftPressed) {
      console.log('arrowDownPressed');
      if(arrowKeyLateralListIndex === 1) {
        setArrowKeyLateralListIndex(0)
        setCounter(0)
        setArrowKeyItemIndex(0);      
      }      
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowLeftPressed]);

  
  React.useEffect(() => {
    if (arrowRightPressed) {
      console.log('arrowDownPressed');
      if(arrowKeyLateralListIndex === 0) {
        setArrowKeyLateralListIndex(1)
        setCounter(0)
        console.log('right key counter', counter);
        console.log('right key arrowKeyLateralListIndex', arrowKeyItemIndex);
        
        setArrowKeyItemIndex(0);
        
      }      
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowRightPressed]);

  

  React.useEffect(() => {
    if (enterKeyPressed) {
      
      console.log('Enter key pressed', filteredPostsData[arrowKeyItemIndex]);
      const {id, handle, title, images}  = filteredPostsData[arrowKeyItemIndex]
      console.log(images.edges[0].node.url)
      setDisplaySearchTerm(title);
      setSearchTerm(title);
      // setFilteredResults([]);      
      setShowResults(false);            
      // router.push(`/product/${handle}`)
    }
  }, [enterKeyPressed]);


  //*************************************************************************************************************************** */
  //*  O T H E R   K E Y S   P R E S S E D 
  //*************************************************************************************************************************** */

  React.useEffect(() => {
    setArrowKeyItemIndex(0)
  }, [searchTerm]);


  //*************************************************************************************************************************** */
  //*  H A N D L E   S E A R C H   T E R M   C H A N G E D
  //*************************************************************************************************************************** */

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    var tmpPostsData = [];
    var tmpAlbumsData = [];
    var tmpCategoriesData = [];

    if (e.target.value.length > 0) {      
      
      postsData.forEach((element) => {
        if (
          element.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          console.log('FOUND', element.title.toLowerCase())                  
          tmpPostsData.push(element);
          if(!tmpCategoriesData.includes(element.category)){
            tmpCategoriesData.push(element.category)
          }
          
        }
      });

      albumData.forEach((element) => {
          if (
            element.title
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            tmpAlbumsData.push(element);
            if(!tmpCategoriesData.includes(element.category)){
              tmpCategoriesData.push(element.category)
            }
            }
      });    
      
      setFilteredResultsCategories(tmpCategoriesData)
      setFilteredPostsData(tmpPostsData);
      setFilteredAlbumsData(tmpAlbumsData);        
    }

  };


   //*************************************************************************************************************************** */
  //*  H A N D L E   O P E N   /   S H O W    S E A R C H
  //*************************************************************************************************************************** */

  const handleOpenSearchResults = () => {    
    setShowResults(true);
  };

  
 //*************************************************************************************************************************** */
  //*  H A N D L E   S E L E C T   P R O D U C T   W I T H   M O U S E   C L I C K 
  //*************************************************************************************************************************** */

  const handleSelectedProduct = (id) => {
    setSelectProduct(id);
    setShowResults(false);    
//    router.push(`/product/${handle}`)
  
  };

  
  //*************************************************************************************************************************** */
  //*  H A N D L E   C L E A R   S E A R C H   T E R M   C H A N G E D
  //*************************************************************************************************************************** */


  const handleClearSearchTerm = (e) => {
    setSearchTerm('');
    setDisplaySearchTerm('')
    setFilteredPostsData([]);
    setFilteredAlbumsData([]);  
    searchInputRef.focus();
  };

  return (
    <>
      <Box
        alignContent="center"
        
        sx={{  position: "absolute", top: "1vh", left: "20vw", zIndex: 99 }}
      >
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
          <Box textAlign="left" sx={{ width: "50vw", position: "relative" }}>
            <Stack spacing={0}>
              <Search>
                 <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <SearchClearIconWrapper >
                  {searchTerm.length > 0 && 
                  <ClearIcon onClick={(e) => handleClearSearchTerm(e)}/>
                  }
                </SearchClearIconWrapper>
                <StyledInputBase
                  inputRef={(input) => { searchInputRef = input }}
                  size="small"
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Products"
                  inputProps={{ "aria-label": "search google maps" }}
                  onChange={(e) => handleSearchTerm(e)}
                  onFocus={() => handleOpenSearchResults()}
                  value={searchTerm}
                />
              </Search>
              
              <SearchResultsGrid
                showResults={showResults}
                searchTerm={searchTerm}                
                handleSelectedProduct={handleSelectedProduct}
              />
            </Stack>
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}


//*************************************************************************************************************************** */
//*  C U S T O M   H O O K   T O   H A N D L E   K E Y B O A R D   E V E N T S
//*************************************************************************************************************************** */

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = React.useState(false);

  React.useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};